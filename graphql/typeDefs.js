const { gql } = require("apollo-server");

module.exports = gql`
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    author: User!
    userAvatar: String!
    comments: [Comment]!
    commentCount: Int!
    answers: [Answer]!
    votes: [Vote]!
    votesCount: Int!
    devotes: [Devote]!
    devotesCount: Int!
    reputationsCount: Int!
    categories: [String!]
    status: String!
  }

  type Comment {
    id: ID!
    createdAt: String!
    body: String!
    author: User!
  }
  type Answer {
    id: ID!
    createdAt: String!
    body: String!
    author: User!
  }

  type Vote {
    id: ID!
    createdAt: String!
    username: String!
  }
  type Devote {
    id: ID!
    createdAt: String!
    username: String!
  }
  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
    avatar: String!
    banner: String!
    role: String!
    followedPosts: [Post!]
  }

  scalar Upload

  type File {
    url: String!
  }

  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  # ROOT TYPE
  type Query {
    getUsers: [User]
    getUser(userId: ID!): User
    getUserFollowedPosts: [Post]
    getPosts: [Post]
    getPost(postId: ID!): Post
    uploads: String!
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    updateUser(avatar: String, password: String): User!
    singleUpload(file: Upload!): File!
    createPost(body: String!, categories: [String!]): Post!
    deletePost(postId: ID!): String!
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    createAnswer(postId: ID!, body: String!): Post!
    deleteAnswer(postId: ID!, answerId: ID!): Post!
    votePost(postId: ID!): Post!
    devotePost(postId: ID!): Post!
    followPost(postId: ID!): Post!
  }
`;
