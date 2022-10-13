import { CreateUsernameResponse, GraphQLContext } from "../../util/types";

const resolvers = {
  Query: {
    searchUsers: () => {},
  },
  Mutation: {
    createUsername: async (
      _: any,
      args: { username: string },
      context: GraphQLContext
    ): Promise<CreateUsernameResponse> => {
      const { username } = args;
      const { prisma, session } = context;

      if (!session?.user) {
        return {
          success: false,
          error: "Authorization error",
        };
      }

      const { id } = session.user;
      console.log("📢[user.ts:24]: session: ", session.user);

      try {
        const existingUser = await prisma.user.findUnique({
          where: {
            username,
          },
        });

        console.log("📢[user.ts:33]: existingUser: ", existingUser);
        if (existingUser) {
          return {
            success: false,
            error: "Username already taken. Try another",
          };
        }

        await prisma.user.update({
          where: {
            id,
          },
          data: {
            username,
          },
        });

        return { success: true };
      } catch (error) {
        return { success: false };
      }
    },
  },
};

export default resolvers;
