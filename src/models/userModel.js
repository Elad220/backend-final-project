const mongoose = require("mongoose");

// define the schema for users collection
const userSchema = new mongoose.Schema({
  id: Number,
  first_name: String,
  last_name: String,
  birthday: String,
});

// define the models for users and costs collections
const User = mongoose.model("User", userSchema);
module.exports = User;
