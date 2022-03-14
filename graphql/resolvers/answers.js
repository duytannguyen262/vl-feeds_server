const { UserInputError, AuthenticationError } = require("apollo-server");

const checkAdmin = require("../../util/checkAdmin");
const Post = require("../../models/Post");

module.exports = {
  Mutation: {
    createAnswer: async (_, { postId, body }, context) => {
      const { username } = checkAdmin(context);
      if (body.trim() === "") {
        throw new UserInputError("Câu trả lời trống", {
          errors: {
            body: "Answer body không được để trống",
          },
        });
      }

      const post = await Post.findById(postId);
      if (post) {
        post.answers.unshift({
          //unshift là thêm vào đầu mảng
          body,
          username,
          createdAt: new Date().toISOString(),
        });
        await post.save();
        return post;
      } else throw new UserInputError("Không tìm thấy bài viết");
    },

    async deleteAnswer(_, { postId, answerId }, context) {
      const { username } = checkAdmin(context);
      const post = await Post.findById(postId);
      if (post) {
        const answerIndex = post.answers.findIndex((answer) => {
          return answer.id === answerId;
        });
        console.log(answerIndex);
        if (post.answers[answerIndex].username === username) {
          post.answers.splice(answerIndex, 1);
          await post.save();
          return post;
        } else {
          throw new AuthenticationError(
            "Bạn không có quyền xóa câu trả lời này"
          );
        }
      } else {
        throw new UserInputError("Không tìm thấy bài viết");
      }
    },
  },
};
