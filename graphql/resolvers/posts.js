const { AuthenticationError } = require("apollo-server");
const ObjectId = require("mongodb").ObjectId;

const Post = require("../../models/Post");
const User = require("../../models/User");
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

  Post: {
    commentCount: (parent) => parent.comments.length,
    votesCount: (parent) => parent.votes.length,
    devotesCount: (parent) => parent.devotes.length,
    reputationsCount: (parent) => {
      return parent.votes.length - parent.devotes.length;
    },

    async author(parent, args, context) {
      try {
        const user = await User.findById(parent.author);
        return user;
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Mutation: {
    async createPost(_, { body, categories }, context) {
      const user = checkAuth(context);
      const { id } = user;
      const foundUser = await User.findById(id);

      if (body.trim() === "") {
        throw new Error("Post body không được để trống");
      }
      const newPost = new Post({
        id,
        body,
        categories,
        author: foundUser,
        createdAt: new Date().toISOString(),
      });

      const post = await newPost.save();

      return post;
    },

    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);
        const author = await User.findById(post.author);

        if (user.id === author.id) {
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

    async followPost(_, { postId }, context) {
      const { id } = checkAuth(context);
      const user = await User.findById(id);
      const post = await Post.findById(postId);
      const objectPostId = ObjectId(postId);

      if (post) {
        if (
          user.followedPosts.find(
            (post) => post.toString() === objectPostId.toString()
          )
        ) {
          //Post already followed, remove follow
          user.followedPosts = user.followedPosts.filter((follow) => {
            return follow.toString() !== objectPostId.toString();
          });
          await user.save();
        } else {
          //Not followed, follow post
          user.followedPosts.unshift(objectPostId);

          await user.save();
        }
      }

      return user;
    },
  },
};
