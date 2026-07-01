const mongoose = require("mongoose")

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    image: {
      type: String,
      required: true,
      trim: true,
    },

    caption: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    likes : [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: []
    }],
    comments : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Comment",
    }]
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema)

module.exports = {Post}