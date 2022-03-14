const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  username: String,
  password: String,
  createdAt: String,
  email: String,
  role: { type: String, default: "student" },
});

module.exports = model("User", userSchema);
