const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Invalid email"],
      immutable : true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
       immutable : true,
    },

    firstName: {
      type: String,
      default: "",
      trim: true,
    },

    lastName: {
      type: String,
      default: "",
      trim: true,
    },

    dob: {
      type: Date,
      immutable : true,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    bio: {
      type: String,
      default: "",
      maxlength: 300,
    },

    dp: {
      type: String,
      default: "",
    },

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],

    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// module.exports = mongoose.model("User", userSchema);
const user = mongoose.model("User", userSchema)
module.exports = {user}