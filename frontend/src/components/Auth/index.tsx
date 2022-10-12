import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { Center, Button, Stack, Text, Input } from "@chakra-ui/react";
import { FormEvent, LegacyRef, useRef } from "react";

interface AuthProps {
  session: Session | null;
  reloadSession: () => void;
}

interface FormValues {
  username: string;
}

export default function Auth({
  reloadSession,
  session,
}: AuthProps): JSX.Element {
  const usernameRef = useRef();

  const handleSubmit = () => {
    // @ts-ignore
    console.log(usernameRef?.current?.value);
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
          </>
        ) : (
          <Text onClick={() => signIn("google")}>Continue with Google</Text>
        )}
      </Stack>
    </Center>
  );
}
