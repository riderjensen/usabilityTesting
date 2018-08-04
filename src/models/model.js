const mongoose = require('mongoose');
const { Schema } = mongoose;
const websiteStorage = new Schema({
  webURL: String,
  testArray: Array,
  needLogIn: { type: Boolean, default: false},
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model("webStorage", websiteStorage);