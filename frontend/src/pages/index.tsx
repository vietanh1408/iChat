import { Box, Text } from "@chakra-ui/react";
import type { NextPage, NextPageContext } from "next";
import { getSession, signIn, useSession } from "next-auth/react";
import Auth from "../components/Auth";
import Chat from "../components/Chat";

const Home: NextPage = () => {
  const { data } = useSession();

  const reloadSession = () => {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
  };

  return (
    <Box>
      {data?.user?.name ? (
        <Chat reloadSession={reloadSession} session={data} />
      ) : (
        <Auth />
      )}
    </Box>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}

export default Home;
