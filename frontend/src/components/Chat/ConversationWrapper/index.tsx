import ConversationOperations from "@/graphql/operations/conversation";
import UserOperations from "@/graphql/operations/user";
import {
  Conversation,
  ConversationsArgs,
  ConversationsData,
} from "@/utils/conversation";
import { SearchUsersData, SearchUsersInput } from "@/utils/user";
import { useLazyQuery, useQuery } from "@apollo/client";
import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Session } from "next-auth";
import { useEffect, useRef, useState } from "react";
import ConversationFeed from "./ConversationFeed";
import ConversationList from "./ConversationList";
import CreateConversationModal from "./CreateConversationModal";

interface ConversationWrapperProps {
  session: Session;
}

export default function ConversationWrapper({
  session,
}: ConversationWrapperProps): JSX.Element {
  const usernameRef =
    useRef<HTMLInputElement>() as React.MutableRefObject<HTMLInputElement>;

  const [openModal, setOpenModal] = useState<boolean>(false);

  const [conversationId, setConversationId] = useState<string>("");

  const [searchUsers, { data: searchedUser }] = useLazyQuery<
    SearchUsersData,
    SearchUsersInput
  >(UserOperations.Queries.searchUsers);

  const { data: conversationList, subscribeToMore } = useQuery<
    ConversationsData,
    ConversationsArgs
  >(ConversationOperations.Queries.conversations, {
    variables: {
      limit: 50,
      offset: 0,
    },
  });

  const subscribeToNewConversation = () => {
    subscribeToMore({
      document: ConversationOperations.Subscriptions.conversationCreated,
      updateQuery: (
        prev,
        {
          subscriptionData,
        }: {
          subscriptionData: {
            data: {
              conversationCreated: Conversation;
            };
          };
        }
      ) => {
        if (!subscriptionData.data) return prev;

        return Object.assign({}, prev, {
          conversations: [
            subscriptionData.data.conversationCreated,
            ...prev?.conversations,
          ],
        });
      },
    });
  };

  const handleSearchUsers = () => {
    if (usernameRef.current?.value) {
      searchUsers({
        variables: {
          username: usernameRef.current?.value,
        },
      });
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  useEffect(() => {
    subscribeToNewConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Flex height="90vh">
        <Box p={5} shadow="md" borderWidth="1px" width={{ base: "40%" }}>
          <Stack spacing={2}>
            <InputGroup>
              <Input placeholder="Enter username" ref={usernameRef} />
              <InputRightElement width="3rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  background="transparent"
                  onClick={handleSearchUsers}
                >
                  <SearchIcon />
                </Button>
              </InputRightElement>
            </InputGroup>

            <Button onClick={handleOpenModal}>Create a conversation</Button>
          </Stack>
          <Flex flexDirection="column">
            <ConversationList
              conversations={conversationList?.conversations ?? []}
              setConversationId={setConversationId}
            />
          </Flex>
        </Box>

        <Box
          p={5}
          shadow="md"
          borderWidth="1px"
          overflowY="scroll"
          width={{ base: "100%" }}
        >
          <ConversationFeed id={conversationId} userId={session.user.id} />
        </Box>
      </Flex>

      {openModal && (
        <CreateConversationModal open={openModal} setOpen={setOpenModal} />
      )}
    </>
  );
}
