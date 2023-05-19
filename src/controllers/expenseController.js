const Expense = require("../models/expenseModel");
const isValidDate = require("../utils/isValidDate");
const isValidUser = require("../utils/isValidUser");
const crypto = require("crypto");

const validCategories = [
  "food",
  "health",
  "housing",
  "sport",
  "education",
  "transportation",
  "other",
];

const addExpense = async (req, res) => {
  const { sum, category, day, month, year, description, user_id } = req.body;
  // Validation
  if (!sum || !category || !month || !year || !day || !description) {
    res.status(400).json({
      status: "fail",
      message: "Please provide all the required fields",
    });
    return;
  }
  // Check if the date is valid
  if (!isValidDate(year, month, day)) {
    res.status(400).json({
      status: "fail",
      message: "Invalid date given, please provide a valid date",
    });
    return;
  }

  // Check if the user exists
  if (!(await isValidUser(user_id, res))) {
    return;
  }

  // Check if the category is valid
  if (!validCategories.includes(category)) {
    res.status(400).json({
      status: "fail",
      message: "Invalid category provided",
    });
    return;
  }

  //Generating a random id for the new expense
  const expense_id = crypto.randomBytes(8).toString("hex");

  //Create expense
  const expense = await Expense.create({
    id: expense_id,
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
    res.status(400).json({
      status: "fail",
      message: "Could not create expense, please try again later",
    });
  }
};
const getAllExpenses = async (req, res) => {
  //get month year and the current user from the query params

  const { user_id, year, month } = req.query;
  if (month < 1 || month > 12 || year < 0) {
    res.status(400).json({
      status: "fail",
      message: "Invalid date given, please provide a valid date",
    });
    return;
  }

  // Check if the user exists
  if (!(await isValidUser(user_id, res))) {
    return;
  }

  // Find the documents in mongodb db
  const docs = await Expense.find({
    month: month,
    year: year,
    user_id: user_id,
  });

  //Checking if there are any expenses for the current user
  if (docs.length === 0) {
    res.status(404).json({
      status: "fail",
      message: "There are no expenses for the specified user.",
    });
    return;
  }
  const report = {
    food: [],
    health: [],
    housing: [],
    sport: [],
    education: [],
    transportation: [],
    other: [],
  };
  // Format the returned document
  docs.forEach((doc) =>
    report[doc.category].push({
      day: doc.day,
      description: doc.description,
      sum: doc.sum,
    })
  );
  res.status(200).json(report);
};

module.exports = {
  addExpense,
  getAllExpenses,
};
