const userResolver = require("./users");
const postResolver = require("./posts");

const rootResolver = {
  ...userResolver,
  ...postResolver
};

module.exports = rootResolver;
