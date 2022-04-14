const path = require("path");
const fs = require("fs");
const checkAuth = require("../../util/checkAuth");
const User = require("../../models/User");

module.exports = {
  Mutation: {
    singleUpload: async (parent, { file }, context) => {
      const { id } = checkAuth(context);
      const foundUser = await User.findById(id);

      const { filename, createReadStream } = await file;
      const time = Date.now();
      const stream = createReadStream();

      const pathName = path.join(
        __dirname + `../../../public/uploads/user:${id}-${time}-${filename}`
      );

      await stream.pipe(fs.createWriteStream(pathName));
      const url = `${process.env.URL}/uploads/user:${id}-${time}-${filename}`;

      foundUser.avatar = url;
      await foundUser.save();

      return {
        url,
      };
    },
  },
};
