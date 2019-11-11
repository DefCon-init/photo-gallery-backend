const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
  image: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Post", postSchema, 'posts');
