import { Text } from "@chakra-ui/react";
import { signIn } from "next-auth/react";

export default function Auth(): JSX.Element {
  return (
    <>
      <Text onClick={() => signIn("google")}>Continue with Google</Text>
    </>
  );
}
