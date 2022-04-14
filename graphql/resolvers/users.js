const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../util/validators");
const { SECRET_KEY } = require("../../config");
const Post = require("../../models/Post");
const User = require("../../models/User");
const checkAuth = require("../../util/checkAuth");

function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    {
      expiresIn: "24h",
    }
  );
}

module.exports = {
  Query: {
    async getUsers() {
      try {
        const users = await User.find().sort({ createdAt: -1 });
        return users;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getUser(_, { userId }) {
      try {
        const user = await User.findById(userId);
        console.log(user);
        return user;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getUserFollowedPosts(_, __, context) {
      const { id } = checkAuth(context);
      try {
        const user = await User.findById(id);
        const followedPosts = user.followedPosts.map((postId) => {
          return Post.findById(postId);
        });
        return followedPosts;
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  User: {
    followedPosts: async (parents) => {
      try {
        const followedPosts = await Promise.all(
          parents.followedPosts.map((postId) => {
            return Post.findById(postId);
          })
        );

        await Promise.all(
          followedPosts.map(async (post) => {
            const author = await User.findById(post.author);
            return { ...post, author };
          })
        );
        return followedPosts;
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Mutation: {
    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } },
      context,
      info
    ) {
      //Validate user data
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      //Make sure user doesn't already exist
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError("Tên đăng nhập đã tồn tại", {
          errors: {
            username: "Tên đăng nhập đã tồn tại",
          },
        });
      }

      //Make sure email doesn't already exist
      const usedEmailUser = await User.findOne({ email });
      if (usedEmailUser) {
        throw new UserInputError("Email đã được sử dụng", {
          errors: {
            email: "Email đã được sử dụng",
          },
        });
      }

      //hash password and create an auth token
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });

      const result = await newUser.save();

      const token = generateToken(result);

      return {
        ...result._doc,
        id: result.id,
        token,
      };
    },

    async login(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError("Lỗi", { errors });
      }

      const user = await User.findOne({ username });

      if (!user) {
        errors.general = "Không tìm thấy người dùng";
        throw new UserInputError("Không tìm thấy người dùng", { errors });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        errors.general = "Sai mật khẩu";
        throw new UserInputError("Sai mật khẩu", { errors });
      }

      const token = generateToken(user);
      return {
        ...user._doc,
        id: user._id,
        token,
        avatar: user.avatar,
        role: user.role,
      };
    },

    async updateUser(_, { avatar, password }, context) {
      const { id } = checkAuth(context);
      try {
        const user = await User.findById(id);
        return {
          ...user._doc,
          avatar,
          password,
        };
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
