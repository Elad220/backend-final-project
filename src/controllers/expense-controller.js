const Expense = require("../models/expense-model");
const User = require("../models/user-model");
const isValidDate = require("../utils/is-valid-date");
const isValidUser = require("../utils/is-valid-user");
const getOrCreateReport = require("../utils/get-or-create-report");

const validCategories = [
  "food",
  "health",
  "housing",
  "sport",
  "education",
  "transportation",
  "other",
];

// Helper function to send error responses
const sendErrorResponse = (res, statusCode, status, message) => {
  res.status(statusCode).json({ status, message });
};

// Add a new expense
const addExpense = async (req, res) => {
  const { sum, category, day, month, year, description, user_id } = req.body;

  // Parameters validation
  if (!sum || !category || !month || !year || !day || !description) {
    sendErrorResponse(
      res,
      400,
      "fail",
      "Please provide all the required fields"
    );
    return;
  }

  // Check if the date is valid
  if (!isValidDate(year, month, day)) {
    sendErrorResponse(
      res,
      400,
      "fail",
      "Invalid date given, please provide a valid date"
    );
    return;
  }

  // Check if the user exists
  if (!(await isValidUser(user_id, res))) {
    return;
  }

  // Check if the category is valid
  if (!validCategories.includes(category)) {
    sendErrorResponse(res, 400, "fail", "Invalid category provided");
    return;
  }

  try {
    // Create expense
    const expense = await Expense.create({
      user_id,
      year,
      month,
      day,
      description,
      category,
      sum,
    });

    if (expense) {
      res.status(201).json({
        id: expense.id,
        user_id: expense.user_id,
        year: expense.year,
        month: expense.month,
        day: expense.day,
        description: expense.description,
        category: expense.category,
        sum: expense.sum,
      });
    } else {
      sendErrorResponse(
        res,
        400,
        "fail",
        "Could not create expense, please try again later"
      );
    }
  } catch (error) {
    console.log(error);
    sendErrorResponse(res, 500, "error", "Internal server error");
  }
};

// Get all expenses for a given user
const getAllExpenses = async (req, res) => {
  const { user_id, year, month } = req.query;

  // Parameters validation
  if (!month || !year || !user_id) {
    sendErrorResponse(
      res,
      400,
      "fail",
      "Please provide all the required parameters"
    );
    return;
  }

  // Check if the date is valid
  if (month < 1 || month > 12 || year < 0) {
    sendErrorResponse(
      res,
      400,
      "fail",
      "Invalid date given, please provide a valid date"
    );
    return;
  }

  // Check if the user exists
  if (!(await isValidUser(user_id, res))) {
    return;
  }

  try {
    const report = await getOrCreateReport(
      user_id,
      year,
      month,
      validCategories
    );

    res.status(200).json(report.data);
  } catch (error) {
    sendErrorResponse(res, 500, "error", "Internal server error");
  }
};

// Get all expenses for a given user
const getAllExpensesWithId = async (req, res) => {
  const { user_id, year, month } = req.query;

  // Parameters validation
  if (!month || !year || !user_id) {
    sendErrorResponse(
      res,
      400,
      "fail",
      "Please provide all the required parameters"
    );
    return;
  }

  // Check if the date is valid
  if (month < 1 || month > 12 || year < 0) {
    sendErrorResponse(
      res,
      400,
      "fail",
      "Invalid date given, please provide a valid date"
    );
    return;
  }

  // Check if the user exists
  if (!(await isValidUser(user_id, res))) {
    return;
  }

  try {
    // Find the documents in MongoDB
    const expenses = await Expense.find({ month, year, user_id });

    // Check if there are any expenses for the specified user
    if (expenses.length === 0) {
      sendErrorResponse(
        res,
        404,
        "fail",
        "There are no expenses for the specified user."
      );
      return;
    }

    const report = validCategories.reduce(
      (acc, category) => ({ ...acc, [category]: [] }),
      {}
    );

    // Format the returned document
    expenses.forEach((expense) => {
      const { day, description, sum, category, id } = expense;
      report[category].push({ day, description, sum, id });
    });

    res.status(200).json(report);
  } catch (error) {
    sendErrorResponse(res, 500, "error", "Internal server error");
  }
};

const removeExpense = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    sendErrorResponse(
      res,
      400,
      "fail",
      "Please provide all the required parameters"
    );
    return;
  }
  try {
    const expense = await Expense.findOne({ id: id });
    if (!expense) {
      sendErrorResponse(
        res,
        404,
        "fail",
        "There is no expense with the specified id."
      );
      return;
    }
    await Expense.deleteOne({ id: id });
    res.status(200).json({
      status: "success",
      message: `Expense ${id} deleted successfully`,
    });
  } catch (error) {
    sendErrorResponse(res, 500, "error", "Internal server error");
  }
};

const createUser = async (req, res) => {
  const { id, first_name, last_name, birthday } = req.body;
  if (!id || !first_name || !last_name || !birthday) {
    sendErrorResponse(
      res,
      400,
      "fail",
      "Please provide all the required fields"
    );
    return;
  }
  try {
    const user = await User.create({
      id: id,
      first_name: first_name,
      last_name: last_name,
      birthday: birthday,
    });
    user.save();
    res.status(201).json({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      birthday: user.birthday,
    });
  } catch (error) {
    sendErrorResponse(res, 500, "error", "Internal server error");
  }
};

const removeUser = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    sendErrorResponse(
      res,
      400,
      "fail",
      "Please provide all the required parameters"
    );
    return;
  }
  try {
    const user = await User.findOne({ id: id });
    if (!user) {
      sendErrorResponse(
        res,
        404,
        "fail",
        "There is no user with the specified id."
      );
      return;
    }
    await User.deleteOne({ id: id });
    res.status(200).json({
      status: "success",
      message: `User ${id} deleted successfully`,
    });
  } catch (error) {
    sendErrorResponse(res, 500, "error", "Internal server error");
  }
};

module.exports = {
  addExpense,
  getAllExpenses,
  getAllExpensesWithId,
  removeExpense,
  createUser,
  removeUser,
};
