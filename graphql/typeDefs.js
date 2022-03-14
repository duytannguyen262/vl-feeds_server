const { gql } = require("apollo-server");

module.exports = gql`
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    comments: [Comment]!
    commentCount: Int!
    answers: [Answer]!
    votes: [Vote]!
    votesCount: Int!
    devotes: [Devote]!
    devotesCount: Int!
    reputationCount: Int!
    categories: [Category]!
  }
  type Category {
    id: ID!
    body: String!
  }
  type Comment {
    id: ID!
    createdAt: String!
    username: String!
    body: String!
  }
  type Answer {
    id: ID!
    createdAt: String!
    username: String!
    body: String!
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
  }

  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
  }

  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    createComment(postId: String!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    createAnswer(postId: String!, body: String!): Post!
    deleteAnswer(postId: ID!, answerId: ID!): Post!
    votePost(postId: ID!): Post!
    devotePost(postId: ID!): Post!
  }

  type Subscription {
    newPost: Post!
  }
`;
