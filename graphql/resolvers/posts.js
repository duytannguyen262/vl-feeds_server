const { AuthenticationError } = require("apollo-server");
const { subscribe } = require("graphql");

const Post = require("../../models/Post");
const checkAuth = require("../../util/checkAuth");

module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },

    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error("Không tìm thấy bài viết");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Mutation: {
    async createPost(_, { body }, context) {
      const user = checkAuth(context);

      if (args.body.trim() === "") {
        throw new Error("Post body không được để trống");
      }

      const newPost = new Post({
        body,
        categories,
        author: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      const post = await newPost.save();

      return post;
    },

    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);
        if (user.username === post.username) {
          await post.delete();
          return "Xóa bài viết thành công";
        } else {
          throw new AuthenticationError("Bạn không có quyền xóa bài viết này");
        }
      } catch (err) {
        throw new Error(err);
      }
    },

    async votePost(_, { postId }, context) {
      const { username } = checkAuth(context);
      const post = await Post.findById(postId);
      if (post) {
        if (post.votes.find((vote) => vote.username === username)) {
          //Post already voted, remove vote
          post.votes = post.votes.filter((vote) => vote.username !== username);
          await post.save();
        } else {
          //Post already devoted, remove devote
          post.devotes = post.devotes.filter(
            (devote) => devote.username !== username
          );
          //Not voted, vote post
          post.votes.push({
            username,
            createdAt: new Date().toISOString(),
          });
        }

        await post.save();
        return post;
      } else throw new UserInputError("Không tìm thấy bài viết");
    },

    async devotePost(_, { postId }, context) {
      const { username } = checkAuth(context);
      const post = await Post.findById(postId);
      if (post) {
        if (post.devotes.find((devote) => devote.username === username)) {
          //Post already devoted, remove devote
          post.devotes = post.devotes.filter(
            (devote) => devote.username !== username
          );
          await post.save();
        } else {
          //Post already voted, remove vote
          post.votes = post.votes.filter((vote) => vote.username !== username);

          //Not devoted, devote post
          post.devotes.push({
            username,
            createdAt: new Date().toISOString(),
          });
        }

        await post.save();
        return post;
      } else throw new UserInputError("Không tìm thấy bài viết");
    },
  },
};
