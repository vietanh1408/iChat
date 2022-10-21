import ConversationOperations from "@/graphql/operations/conversation";
import UserOperations from "@/graphql/operations/user";
import useDebounce from "@/hooks/useDebounce";
import { Conversation, CreateConversationInput } from "@/utils/conversation";
import {
  SearchUsersByKeywordInput,
  SearchUsersByKeywordResponse,
  User,
} from "@/utils/user";
import { useLazyQuery, useMutation } from "@apollo/client";
import { SearchIcon, SmallCloseIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { ChangeEvent, FocusEvent, useRef, useState } from "react";

interface CreateConversationModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function CreateConversationModal({
  open,
  setOpen,
}: CreateConversationModalProps): JSX.Element {
  const [openList, setOpenList] = useState<boolean>(false);

  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const nameConversationRef =
    useRef<HTMLInputElement>() as React.MutableRefObject<HTMLInputElement>;

  const [searchUsersByKeyword, { data }] = useLazyQuery<
    SearchUsersByKeywordResponse,
    SearchUsersByKeywordInput
  >(UserOperations.Queries.searchUsersByKeyword);

  const [createConversation, { loading }] = useMutation<
    Conversation,
    CreateConversationInput
  >(ConversationOperations.Mutations.createConversation);

  const handleSearchUsers = useDebounce((e: ChangeEvent<HTMLInputElement>) => {
    searchUsersByKeyword({
      variables: {
        keyword: e.target.value,
        selectedUsers: selectedUsers.map((user) => user.id),
      },
    });
    setOpenList(true);
  }, 500);

  const handleRemove = (user: User) => {
    setSelectedUsers((prev) => {
      const index = prev.indexOf(user);
      if (index > -1) {
        prev.splice(index, 1);
      }
      return [...prev];
    });
  };

  const handleChoose = (user: User) => {
    setOpenList(false);
    setSelectedUsers((prev) => {
      return [...prev, user];
    });
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    if (e.target.value) {
      searchUsersByKeyword({
        variables: {
          keyword: e.target.value,
          selectedUsers: selectedUsers.map((user) => user.id),
        },
      });
      setOpenList(true);
    }
  };

  const handleCreateConversation = () => {
    createConversation({
      variables: {
        ids: selectedUsers.map((user) => user.id),
        name: nameConversationRef.current.value,
      },
      onCompleted: () => setOpen(false),
      onError: () => setOpen(false),
    });
  };

  return (
    <Modal
      isOpen={open}
      onClose={() => setOpen(false)}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>CREATE A CONVERSATION</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <InputGroup position="relative">
            <Input
              placeholder="Enter username"
              onChange={handleSearchUsers}
              onFocus={handleFocus}
            />
            <InputRightElement width="3rem">
              <SearchIcon />
            </InputRightElement>

            {data?.searchUsersByKeyword.users?.length && openList && (
              <List
                spacing={3}
                overflowY="scroll"
                padding="2"
                maxHeight="150px"
                width="100%"
                position="absolute"
                top="100%"
                borderRadius="5"
                border="1px solid white"
                background="#0E1117"
                zIndex={1}
              >
                {data?.searchUsersByKeyword?.users.map((user) => (
                  <ListItem
                    key={user.id}
                    cursor="pointer"
                    onClick={() => handleChoose(user)}
                  >
                    <Flex alignItems="center">
                      <Avatar w={8} h={8} src={user.image as string} />
                      <Box
                        height={{ base: "100%" }}
                        display="flex"
                        alignItems="center"
                      >
                        <Text ml="2">{user?.name}</Text>
                      </Box>
                    </Flex>
                  </ListItem>
                ))}
              </List>
            )}
          </InputGroup>

          <Wrap paddingY="2">
            {selectedUsers.map((user) => (
              <WrapItem
                key={user.id}
                alignItems="start"
                padding="2"
                shadow="md"
                borderRadius="5"
                background="GrayText"
              >
                <Avatar
                  w={8}
                  h={8}
                  src={user.image as string}
                  srcSet={user.image as string}
                />
                <Box
                  height={{ base: "100%" }}
                  display="flex"
                  alignItems="center"
                >
                  <Text ml="2">{user?.name}</Text>
                </Box>
                <SmallCloseIcon
                  ml="2"
                  cursor="pointer"
                  onClick={() => handleRemove(user)}
                />
              </WrapItem>
            ))}
          </Wrap>

          <Divider marginBottom="1rem" />
          <Input
            placeholder="Enter name of conversation"
            disabled={!selectedUsers.length}
            ref={nameConversationRef}
          />
        </ModalBody>

        <ModalFooter>
          <Button
            width={{ base: "100%" }}
            colorScheme="facebook"
            onClick={handleCreateConversation}
            disabled={!selectedUsers.length}
            isLoading={loading}
          >
            Create a conversation
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
