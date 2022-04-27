const { model, Schema } = require("mongoose");

const postSchema = new Schema({
  body: String,
  username: String,
  createdAt: String,
  categories: [String],
  comments: [
    {
      body: String,
      createdAt: String,
      author: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    },
  ],
  answers: [
    {
      body: String,
      createdAt: String,
      author: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    },
  ],
  votes: [
    {
      username: String,
      createdAt: String,
    },
  ],
  devotes: [
    {
      username: String,
      createdAt: String,
    },
  ],
  author: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = model("Post", postSchema);
