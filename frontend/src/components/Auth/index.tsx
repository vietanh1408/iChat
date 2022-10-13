import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import { Center, Button, Stack, Text, Input } from "@chakra-ui/react";
import { FormEvent, LegacyRef, useRef } from "react";
import { useMutation } from "@apollo/client";
import UserOperation from "../../graphql/operations/user";

interface AuthProps {
  session: Session | null;
  reloadSession: () => void;
}

interface FormValues {
  username: string;
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

export default function Auth({
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
    <Center height="100vh">
      <Stack>
        {session ? (
          <>
            <Input
              placeholder="Enter your username"
              // @ts-ignore
              ref={usernameRef}
            />
            <Button onClick={handleSubmit}>Create</Button>
            <Button onClick={handleLogout}>Log out</Button>
          </>
        ) : (
          <Text onClick={() => signIn("google")}>Continue with Google</Text>
        )}
      </Stack>
    </Center>
  );
}
