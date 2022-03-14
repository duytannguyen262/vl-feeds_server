const postsResolvers = require("./posts");
const usersResolvers = require("./users");
const commentsResolvers = require("./comments");
const answersResolvers = require("./answers");

module.exports = {
  Post: {
    reputationCount: (parent) => {
      const votesCount = parent.votes.length;
      const devotesCount = parent.devotes.length;

      const reputationCount = votesCount - devotesCount;

      return reputationCount;
    },
    commentCount: (parent) => parent.comments.length,
    votesCount: (parent) => parent.votes.length,
    devotesCount: (parent) => parent.devotes.length,
  },
  Query: {
    ...postsResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation,
    ...commentsResolvers.Mutation,
    ...answersResolvers.Mutation,
  },
};
