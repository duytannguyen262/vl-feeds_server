const checkAuth = require("../../util/checkAuth");
const User = require("../../models/User");

module.exports = {
  Mutation: {
    uploadUserImg: async (parent, { avatar, banner }, context) => {
      //const fileId = await storeFile(file).then((result) => result);
      const { id } = checkAuth(context);
      const foundUser = await User.findById(id);
      if (avatar) {
        foundUser.avatar = avatar;
      }
      if (banner) {
        foundUser.banner = banner;
      }
      await foundUser.save();

      return foundUser;
    },
  },
};
