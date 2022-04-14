const { model, Schema } = require("mongoose");

module.exports.SingleFile = model(
  "Upload",
  Schema(
    {
      url: {
        type: String,
        required: true,
      },
    },
    { timeStamps: true }
  )
);
