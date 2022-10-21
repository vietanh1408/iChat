import { useMutation } from "@apollo/client";
import { Avatar, Box, Button, Flex, Spacer, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { Fragment, useRef } from "react";
import UserOperation from "@/graphql/operations/user";
import ConversationWrapper from "./ConversationWrapper";

interface AuthProps {
  session: Session | null;
  reloadSession: () => void;
}

interface CreateUsernameVariables {
  username: string;
}

interface CreateUsernameData {
  createUsername: {
    success: boolean;
    error: string;
  };
}

export default function Chat({
  reloadSession,
  session,
}: AuthProps): JSX.Element {
  const usernameRef = useRef<{ value: string }>();

  const [createUsername, { data, loading, error }] = useMutation<
    CreateUsernameData,
    CreateUsernameVariables
  >(UserOperation.Mutations.createUsername);

  const handleSubmit = async () => {
    if (!usernameRef?.current?.value) return;
    try {
      const { data } = await createUsername({
        variables: {
          username: usernameRef?.current?.value as string,
        },
      });

      if (!data?.createUsername) {
        throw new Error();
      }

      if (data.createUsername.error) {
        const {
          createUsername: { error },
        } = data;

        throw new Error(error);
      }

      reloadSession();
    } catch (error) {
      console.log("📢[index.tsx:35]: error: ", error);
    }
  };

  const handleLogout = () => {
    signOut();
  };

  return (
    <>
      {session && (
        <Fragment>
          <Flex minWidth="max-content" alignItems="center" gap="2" padding="3">
            <Avatar src={session.user.image} srcSet={session.user.image} />
            <Box ml="2">
              <Text textAlign="start">{session.user.name}</Text>
              <Text fontSize="sm" textAlign="start">
                {session.user.email}
              </Text>
            </Box>
            <Spacer />
            <Button onClick={handleLogout}>Log out</Button>
          </Flex>
          <ConversationWrapper session={session} />
        </Fragment>
      )}
    </>
  );
}
