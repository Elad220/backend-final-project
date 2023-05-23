const User = require("../models/user-model");

// Check if user exists in the mongoDB database
const isValidUser = async (user_id, res) => {
  const user = await User.findOne({ id: user_id });
  if (!user) {
    res.status(400).json({
      status: "fail",
      message: "User not found",
    });
    return false;
  }
  return true;
};

module.exports = isValidUser;
