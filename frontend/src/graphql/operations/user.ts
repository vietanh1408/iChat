import { gql } from "@apollo/client";

export default {
  Queries: {
    searchUsers: gql`
      query SearchUsers($username: String!) {
        searchUsers(username: $username) {
          success
          error
          users {
            id
            name
            email
            name
            image
          }
        }
      }
    `,

    searchUsersByKeyword: gql`
      query SearchUsersByKeyword($keyword: String!, $selectedUsers: [String]) {
        searchUsersByKeyword(keyword: $keyword, selectedUsers: $selectedUsers) {
          success
          error
          users {
            id
            name
            email
            name
            image
          }
        }
      }
    `,
  },
  Mutations: {
    createUsername: gql`
      mutation CreateUsername($username: String!) {
        createUsername(username: $username) {
          success
          error
        }
      }
    `,
  },
  Subscription: {},
};
