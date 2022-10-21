import {
  CreateUsernameResponse,
  GraphQLContext,
  SearchUsersResponse,
} from '@/utils/types';

interface SearchUsersByKeywordArgs {
  keyword: string;
  selectedUsers: string[];
}

const resolvers = {
  Query: {
    searchUsers: async (
      _: any,
      args: { username: string },
      context: GraphQLContext
    ): Promise<SearchUsersResponse> => {
      const { username } = args;

      const { prisma, session } = context;

      try {
        const users = await prisma.user.findMany({
          where: {
            name: {
              contains: username,
              not: session?.user.name,
              mode: 'insensitive',
            },
          },
        });

        return {
          success: true,
          users,
        };
      } catch (error) {
        return {
          success: false,
        };
      }
    },

    searchUsersByKeyword: async (
      _: any,
      args: SearchUsersByKeywordArgs,
      context: GraphQLContext
    ): Promise<SearchUsersResponse> => {
      const { keyword, selectedUsers } = args;

      const { prisma, session } = context;

      if (!keyword) {
        return {
          success: true,
          users: [],
        };
      }

      try {
        const users = await prisma.user.findMany({
          where: {
            name: {
              contains: keyword,
              not: session?.user.name,
              mode: 'insensitive',
            },
            id: {
              notIn: selectedUsers,
            },
          },
        });

        return {
          success: true,
          users,
        };
      } catch (error) {
        return {
          success: false,
        };
      }
    },
  },
  Mutation: {
    createUsername: async (
      _: any,
      args: { username: string },
      context: GraphQLContext
    ): Promise<CreateUsernameResponse> => {
      const { username } = args;
      const { prisma, session } = context;

      try {
        const existingUser = await prisma.user.findUnique({
          where: {
            id: session?.user.id,
          },
        });

        if (existingUser != null) {
          return {
            success: false,
            error: 'Username already taken. Try another',
          };
        }

        await prisma.user.update({
          where: {
            id: session?.user.id,
          },
          data: {
            name: username,
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
