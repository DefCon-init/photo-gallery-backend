const DataLoader = require("dataloader");

const Post = require("../models/post");
const User = require("../models/user");
const { dateToString } = require("./date");

const postLoader = new DataLoader(postIds => {
  return posts(postIds);
});

const posts = async postIds => {
  try {
    const posts = await Post.find({ _id: { $in: postIds } });
    posts.sort((a, b) => {
      return (
        postIds.indexOf(a._id.toString()) - postIds.indexOf(b._id.toString())
      );
    });
    return posts.map(post => {
      return transformPost(post);
    });
  } catch (err) {
    throw err;
  }
};

const singleUser = async userId => {
  try {
    const user = await User.findById(userId);
    return {
      id: user.id,
      email: user.email
    };
  } catch (err) {
    throw err;
  }
};

const transformPost = post => {
  return {
    ...post._doc,
    id: post.id,
    date: dateToString(post._doc.date),
    user: singleUser.bind(this, post._doc.user)
  };
};

const transformUser = user => {
  return {
    ...user,
    id: user.id,
    email: user.email,
    posts: () => postLoader.loadMany(user.posts)
  };
};

module.exports = {
  transformPost,
  transformUser
};
