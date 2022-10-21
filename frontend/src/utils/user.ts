export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: string;
  image: string;
}

export interface SearchUsersData {
  success?: boolean;
  error?: string;
  users?: User[];
}

export interface SearchUsersResponse {
  searchUsers: SearchUsersData;
}

export interface SearchUsersInput {
  username: string;
}

export interface SearchUsersByKeywordResponse {
  searchUsersByKeyword: SearchUsersData;
}

export interface SearchUsersByKeywordInput {
  keyword: string;
  selectedUsers: string[];
}
