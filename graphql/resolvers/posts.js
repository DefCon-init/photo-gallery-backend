const Post = require("../../models/post");
const User = require("../../models/user");
const transform = require("../../helpers/transform");
module.exports = {
  createPost: async (args, req) => {
    const user = await User.findById(args.postInput.userId);
    if (!user) {
      throw new Error("User not found.");
    }
    const post = new Post({
      image: args.postInput.image,
      date: new Date(args.postInput.date),
      user: args.postInput.userId
    });
    let createdPost;
    try {
      const result = await post.save();
      createdPost = transform.transformPost(result);
      user.posts.push(post);
      await user.save();

      return createdPost;
    } catch (err) {
      throw err;
    }
  }
};
