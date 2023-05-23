const User = require("../models/user-model");
const Cost = require("../models/expense-model");

// remove all users from the database
const removeUsers = async (req, res) => {
  try {
    await User.deleteMany({});
    res.status(200).json({
      status: "success",
      message: "All users have been deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while deleting users",
      error: err.message,
    });
  }
};

// remove all expenses from the database
const removeExpenses = async (req, res) => {
  try {
    await Cost.deleteMany({});
    res.status(200).json({
      status: "success",
      message: "All expenses have been deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while deleting expenses",
      error: err.message,
    });
  }
};

module.exports = { removeUsers, removeExpenses };
