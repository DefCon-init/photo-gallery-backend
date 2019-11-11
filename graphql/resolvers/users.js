const User = require("../../models/user");
const transform = require("../../helpers/transform");

module.exports = {
  users: async () => {
    try {
      const users = await User.find();
      return users;
    } catch (err) {
      throw err;
    }
  },
  userById: async (args, req) => {
    try {
      const user = await User.findById(args.id);
      const returnObj = transform.transformUser(user);
      return returnObj;
    } catch (err) {
      throw err;
    }
  },
  userByEmail: async (args, req) => {
    try {
      const user = await User.findOne({ email: args.email });
      const returnObj = transform.transformUser(user);
      return returnObj;
    } catch (err) {
      throw err;
    }
  }
};
