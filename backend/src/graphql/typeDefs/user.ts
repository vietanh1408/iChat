import { gql } from 'apollo-server-core';

const typeDefs = gql`
  scalar Date

  type User {
    id: String
    name: String
    email: String
    image: String
    emailVerified: Date
  }

  type SearchUsers {
    success: Boolean
    error: String
    users: [User]
  }

  type Query {
    searchUsers(username: String): SearchUsers
    searchUsersByKeyword(keyword: String, selectedUsers: [String]): SearchUsers
  }

  type Mutation {
    createUsername(username: String): CreateUsernameResponse
  }

  type CreateUsernameResponse {
    success: Boolean
    error: String
  }
`;

export default typeDefs;
