const mongoose = require('mongoose');
const { Schema } = mongoose;
const websiteStorage = new Schema({
  webURL: String,
  testArray: Array,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model("webStorage", websiteStorage);