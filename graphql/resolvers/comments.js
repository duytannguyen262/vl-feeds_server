const { UserInputError, AuthenticationError } = require("apollo-server");

const checkAuth = require("../../util/checkAuth");
const Post = require("../../models/Post");

module.exports = {
  Mutation: {
    createComment: async (_, { postId, body }, context) => {
      const { username } = checkAuth(context);
      if (body.trim() === "") {
        throw new UserInputError("Bình luận trống", {
          errors: {
            body: "Comment body không được để trống",
          },
        });
      }

      const post = await Post.findById(postId);
      if (post) {
        post.comments.unshift({
          //unshift là thêm vào đầu mảng
          body,
          username,
          createdAt: new Date().toISOString(),
        });
        await post.save();
        return post;
      } else throw new UserInputError("Không tìm thấy bài viết");
    },

    async deleteComment(_, { postId, commentId }, context) {
      const { username } = checkAuth(context);
      const post = await Post.findById(postId);
      if (post) {
        const commentIndex = post.comments.findIndex(
          (comment) => comment.id === commentId
        );
        if (post.comments[commentIndex].username === username) {
          post.comments.splice(commentIndex, 1);
          await post.save();
          return post;
        } else {
          throw new AuthenticationError("Bạn không có quyền xóa bình luận này");
        }
      } else {
        throw new UserInputError("Không tìm thấy bài viết");
      }
    },
  },
};
