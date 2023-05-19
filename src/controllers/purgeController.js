const User = require("../models/userModel");
const Cost = require("../models/expenseModel");

const removeUser = async (req, res) => {
  try {
    await User.deleteMany({});
    res.status(200).json({
      status: "success",
      message: "All users have been deleted successfully",
    });
  } catch (err) {
    console.log(err);
  }
};

const removeExpenses = async (req, res) => {
  try {
    await Cost.deleteMany({});
    res.status(200).json({
      status: "success",
      message: "All expenses have been deleted successfully",
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { removeUser, removeExpenses };
