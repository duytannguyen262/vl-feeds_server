const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  username: String,
  password: String,
  createdAt: String,
  email: String,
  avatar: { type: String, default: "" },
  role: { type: String, default: "student" },
  followedPosts: [
    {
      type: Schema.Types.ObjectId,
      ref: "posts",
    },
  ],
});

module.exports = model("User", userSchema);
