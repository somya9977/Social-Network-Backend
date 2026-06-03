const mongoose = require("mongoose")

const varifySchemaMail = new  mongoose.Schema({
    email: {
    type: String,
    required: true,
    unique: true,
  }
})
const varifyMail = mongoose.model("varifyMail", varifySchemaMail)
module.exports = {
    varifyMail
}