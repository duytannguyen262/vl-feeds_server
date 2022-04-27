const path = require("path");
const fs = require("fs");
const gfs = require("gridfs");
const checkAuth = require("../../util/checkAuth");
const User = require("../../models/User");
const { storeFile } = require("../../middlewares/file");

module.exports = {
  Mutation: {
    singleUpload: async (parent, { file }, context) => {
      const { id } = checkAuth(context);
      const foundUser = await User.findById(id);

      const { filename, createReadStream } = await file;
      const time = Date.now();
      const stream = createReadStream();

      const pathName = path.join(
        __dirname + `../../../public/uploads/user${id}-${filename}`
      );

      await stream.pipe(fs.createWriteStream(pathName));
      const url = `${process.env.URL}/uploads/user${id}-${filename}`;

      foundUser.avatar = url;
      await foundUser.save();

      return {
        url,
      };
    },

    uploadFileToDtb: async (parent, { file }, context) => {
      await storeFile(file).then((result) => result);
      const { id } = checkAuth(context);
      const foundUser = await User.findById(id);

      const { filename, createReadStream } = await file;
      const time = Date.now();
      const stream = createReadStream();

      const pathName = path.join(
        __dirname + `../../../public/uploads/user${id}-${filename}`
      );

      await stream.pipe(fs.createWriteStream(pathName));
      const url = `${process.env.URL}/uploads/user${id}-${filename}`;

      foundUser.avatar = url;
      await foundUser.save();

      return {
        url,
      };
    },
  },
};
