const { model, Schema } = require("mongoose");

const postSchema = new Schema({
  body: String,
  username: String,
  createdAt: String,
  categories: [
    {
      body: String,
    },
  ],
  comments: [
    {
      body: String,
      username: String,
      createdAt: String,
    },
  ],
  answers: [
    {
      body: String,
      username: String,
      createdAt: String,
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
