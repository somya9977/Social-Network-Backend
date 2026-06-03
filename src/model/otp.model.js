const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  otp: {
    type: String,
    required: true,
  },

  expiresAt: {
    type: Date,
    required: true,
    default : Date.now(),
   expires: 300
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("OTP", otpSchema);