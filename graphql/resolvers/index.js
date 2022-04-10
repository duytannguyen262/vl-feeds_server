const postsResolvers = require("./posts");
const usersResolvers = require("./users");
const commentsResolvers = require("./comments");
const answersResolvers = require("./answers");

module.exports = {
  Query: {
    ...postsResolvers.Query,
    ...usersResolvers.Query,
  },
  Post: {
    ...postsResolvers.Post,
  },
  User: {
    ...usersResolvers.User,
  },
  Comment: {
    ...commentsResolvers.Comment,
  },
  Answer: { ...answersResolvers.Answer },
  Mutation: {
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation,
    ...commentsResolvers.Mutation,
    ...answersResolvers.Mutation,
  },
};
