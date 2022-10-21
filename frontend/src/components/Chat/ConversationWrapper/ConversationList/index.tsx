import { Conversation } from "@/utils/conversation";
import { Avatar, AvatarGroup, Flex, Text } from "@chakra-ui/react";

interface ConversationListProps {
  conversations: Conversation[];
  setConversationId: (id: string) => void;
}

export default function ConversationList({
  conversations,
  setConversationId,
}: ConversationListProps): JSX.Element {
  const handleClickConversation = (id: string) => {
    setConversationId(id);
  };

  return (
    <>
      {conversations?.map((conversation) => (
        <Flex
          key={conversation.id}
          alignItems="center"
          gap="2"
          paddingY="3"
          cursor="pointer"
          onClick={() => handleClickConversation(conversation.id)}
        >
          <AvatarGroup size="md" max={2}>
            {conversation?.participants?.map((participant) => (
              <Avatar
                w={10}
                h={10}
                key={participant.id}
                name={participant.user.name as string}
                src={participant.user.image as string}
              />
            ))}
          </AvatarGroup>
          <Text textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">
            {conversation.name}
          </Text>
        </Flex>
      ))}
    </>
  );
}
