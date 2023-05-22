const mongoose = require("mongoose");

// Define the schema for users collection
const userSchema = new mongoose.Schema({
  id: Number,
  first_name: String,
  last_name: String,
  birthday: String,
});

// Define the models for users collection
const User = mongoose.model("User", userSchema);
module.exports = User;
