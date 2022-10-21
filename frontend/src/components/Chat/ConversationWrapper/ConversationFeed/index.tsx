import ConversationOperations from "@/graphql/operations/conversation";
import MessageOperations from "@/graphql/operations/message";
import { ConversationData } from "@/utils/conversation";
import { Message, MessagesData } from "@/utils/message";
import { useMutation, useQuery } from "@apollo/client";
import {
  Avatar,
  AvatarGroup,
  Button,
  Flex,
  FormControl,
  Heading,
  Input,
  Tag,
} from "@chakra-ui/react";
import { Field, FieldProps, Form, Formik, FormikHelpers } from "formik";
import { useEffect, useRef } from "react";

interface ConversationFeedProps {
  id: string;
  userId: string;
}

interface CreateMessageVariables {
  conversationId: string;
  message: string;
}

interface CreateMessageData {
  message: Message;
}

interface FormValues {
  message: string;
}

export default function ConversationFeed({
  id,
  userId,
}: ConversationFeedProps): JSX.Element {
  const chatFeedRef =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;

  const scrollToBottom = () => {
    setTimeout(() => {
      chatFeedRef.current.scroll({
        top: chatFeedRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 500);
  };

  const { data: conversation } = useQuery<ConversationData, { id: string }>(
    ConversationOperations.Queries.conversation,
    {
      variables: {
        id,
      },
    }
  );

  const { data: messages, subscribeToMore } = useQuery<
    MessagesData,
    { conversationId: string }
  >(MessageOperations.Queries.messages, {
    variables: {
      conversationId: id,
    },
    onCompleted: () => scrollToBottom(),
  });

  const subscribeToNewMessage = () => {
    subscribeToMore({
      document: MessageOperations.Subscriptions.messageCreated,
      updateQuery: (
        prev,
        {
          subscriptionData,
        }: {
          subscriptionData: {
            data: {
              messageCreated: Message;
            };
          };
        }
      ) => {
        if (!subscriptionData.data) return prev;

        return Object.assign({}, prev, {
          messages: [...prev?.messages, subscriptionData.data.messageCreated],
        });
      },
    });
  };

  const [createMessage] = useMutation<
    CreateMessageData,
    CreateMessageVariables
  >(MessageOperations.Mutations.createMessage);

  const handleSendMessage = (
    values: FormValues,
    form: FormikHelpers<FormValues>
  ) => {
    if (values.message) {
      createMessage({
        variables: {
          conversationId: id,
          message: values.message,
        },
        onCompleted: () => scrollToBottom(),
      });
    }
    form.resetForm();
  };

  useEffect(() => {
    subscribeToNewMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Flex flexDirection="column" justifyContent="space-between" height="100%">
      <Flex alignItems="center" gap="2" cursor="pointer" marginBottom={4}>
        <AvatarGroup size="md" max={2}>
          {conversation?.conversation?.participants?.map((participant) => (
            <Avatar
              key={participant.id}
              name={participant.user.name as string}
              src={participant.user.image as string}
            />
          ))}
        </AvatarGroup>
        <Heading
          as="h2"
          textOverflow="ellipsis"
          overflow="hidden"
          whiteSpace="nowrap"
        >
          {conversation?.conversation.name}
        </Heading>
      </Flex>
      <Flex
        flex={1}
        gap={6}
        paddingY={4}
        id="chat-wrapper"
        ref={chatFeedRef}
        flexDirection="column"
        overflowY="scroll"
      >
        {messages?.messages.map((message) => {
          const isYourMessage = message.senderId === userId;
          return (
            <Flex
              key={message.id}
              justifyContent={isYourMessage ? "end" : "start"}
              flexDirection={isYourMessage ? "row-reverse" : "row"}
              gap={2}
            >
              <Avatar src={message.sender.image as string} />
              <Tag key={message.id}>{message.message}</Tag>
            </Flex>
          );
        })}
      </Flex>

      <Formik initialValues={{ message: "" }} onSubmit={handleSendMessage}>
        {() => (
          <Form>
            <Field name="message">
              {({ field }: FieldProps) => (
                <FormControl>
                  <Flex gap={2} paddingTop={2}>
                    <Input {...field} placeholder="Send a message" />
                    <Button type="submit" colorScheme="blue">
                      Send
                    </Button>
                  </Flex>
                </FormControl>
              )}
            </Field>
          </Form>
        )}
      </Formik>
    </Flex>
  );
}
