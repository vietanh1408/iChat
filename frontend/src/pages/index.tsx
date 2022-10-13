import { Box } from "@chakra-ui/react";
import type { NextPage, NextPageContext } from "next";
import { getSession, useSession } from "next-auth/react";
import Auth from "../components/Auth";
import Chat from "../components/Chat";

const Home: NextPage = () => {
  const { data } = useSession();

  console.log("📢[index.tsx:7]: data: ", data);

  const reloadSession = () => {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
  };

  return (
    <Box>
      {data?.user?.username ? (
        <Chat />
      ) : (
        <Auth reloadSession={reloadSession} session={data} />
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
