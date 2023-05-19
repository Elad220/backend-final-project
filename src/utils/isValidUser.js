const User = require("../models/userModel");
// Check if user exists
const isValidUser = async (user_id, res) => {
  const user = await User.findOne({ id: user_id });
  if (!user) {
    res.status(404).json({
      status: "fail",
      message: "User not found",
    });
    return false;
  }
  return true;
};

module.exports = isValidUser;
