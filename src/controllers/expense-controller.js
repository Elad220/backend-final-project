const Expense = require('../models/expense-model');
const User = require('../models/user-model');
const Report = require('../models/report-model');
const isValidDate = require('../utils/is-valid-date');
const isValidUser = require('../utils/is-valid-user');
const getOrCreateReport = require('../utils/get-or-create-report');

// Valid categories for expenses
const validCategories = [
  'food',
  'health',
  'housing',
  'sport',
  'education',
  'transportation',
  'other'
];

// Helper function to send error responses
const sendErrorResponse = (res, statusCode, status, message) => {
  res.status(statusCode).json({ status, message });
};

// Add a new expense
const addExpense = async (req, res) => {
  const {
    sum,
    category,
    day,
    month,
    year,
    description,
    user_id: userId
  } = req.body;

  // Parameters validation
  if (!sum || !category || !month || !year || !day || !description) {
    sendErrorResponse(
      res,
      400,
      'fail',
      'Please provide all the required fields'
    );
    return;
  }

  // Check if the date is valid
  if (!isValidDate(year, month, day)) {
    sendErrorResponse(
      res,
      400,
      'fail',
      'Invalid date given, please provide a valid date'
    );
    return;
  }

  // Check if the user exists
  if (!(await isValidUser(userId, res))) {
    return;
  }

  // Check if the category is valid
  if (!validCategories.includes(category)) {
    sendErrorResponse(res, 400, 'fail', 'Invalid category provided');
    return;
  }

  try {
    // Create expense
    const expense = await Expense.create({
      user_id: userId,
      year,
      month,
      day,
      description,
      category,
      sum
    });

    if (expense) {
      // Delete the corresponding report
      await Report.deleteOne({ user_id: userId, year, month });

      // Send response
      res.status(201).json({
        id: expense.id,
        user_id: expense.user_id,
        year: expense.year,
        month: expense.month,
        day: expense.day,
        description: expense.description,
        category: expense.category,
        sum: expense.sum
      });
      // Send error response
    } else {
      sendErrorResponse(
        res,
        400,
        'fail',
        'Could not create expense, please try again later'
      );
    }
    // Send error response
  } catch (error) {
    console.log(error);
    sendErrorResponse(res, 500, 'error', 'Internal server error');
  }
};

// Get all expenses for a given user
const getAllExpenses = async (req, res) => {
  const { user_id: userId, year, month } = req.query;

  // Parameters validation
  if (!month || !year || !userId) {
    sendErrorResponse(
      res,
      400,
      'fail',
      'Please provide all the required parameters'
    );
    return;
  }

  // Check if the date is valid
  if (month < 1 || month > 12 || year < 0) {
    sendErrorResponse(
      res,
      400,
      'fail',
      'Invalid date given, please provide a valid date'
    );
    return;
  }

  // Check if the user exists
  if (!(await isValidUser(userId, res))) {
    return;
  }
  // Generate report if one doesn't exist
  try {
    const report = await getOrCreateReport(
      userId,
      year,
      month,
      validCategories
    );

    res.status(200).json(report.data);
  } catch (error) {
    sendErrorResponse(res, 500, 'error', 'Internal server error');
  }
};

// Remove a single expense
const removeExpense = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    sendErrorResponse(
      res,
      400,
      'fail',
      'Please provide all the required parameters'
    );
    return;
  }
  // Check if the expense exists
  try {
    const expense = await Expense.findOne({ id });
    if (!expense) {
      sendErrorResponse(
        res,
        404,
        'fail',
        'There is no expense with the specified id.'
      );
      return;
    }
    // Delete the expense
    await Expense.deleteOne({ id });
    res.status(200).json({
      status: 'success',
      message: `Expense ${id} deleted successfully`
    });
  } catch (error) {
    sendErrorResponse(res, 500, 'error', 'Internal server error');
  }
};

// Create a new user
const createUser = async (req, res) => {
  const { id, first_name: firstName, last_name: lastName, birthday } = req.body;
  if (!id || !firstName || !lastName || !birthday) {
    sendErrorResponse(
      res,
      400,
      'fail',
      'Please provide all the required fields'
    );
    return;
  }
  // Create user
  try {
    const user = await User.create({
      id,
      first_name: firstName,
      last_name: lastName,
      birthday
    });
    user.save();
    res.status(201).json({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      birthday: user.birthday
    });
  } catch (error) {
    sendErrorResponse(res, 500, 'error', 'Internal server error');
  }
};

// Remove a report
const removeReport = async (req, res) => {
  const { user_id: userId, year, month } = req.body;
  if (!userId || !year || !month) {
    sendErrorResponse(
      res,
      400,
      'fail',
      'Please provide all the required parameters'
    );
    return;
  }
  // Check if the report exists
  try {
    const report = await Report.findOne({ user_id: userId, year, month });
    if (!report) {
      sendErrorResponse(
        res,
        404,
        'fail',
        'There is no report with the specified parameters.'
      );
    } else {
      await Report.deleteOne({ user_id: userId, year, month });
      res.status(200).json({
        status: 'success',
        message: `Report for ${userId} at month ${month} and year ${year} deleted successfully`
      });
    }
  } catch (error) {
    sendErrorResponse(res, 500, 'error', 'Internal server error');
  }
};

// Remove a user
const removeUser = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    sendErrorResponse(
      res,
      400,
      'fail',
      'Please provide all the required parameters'
    );
    return;
  }
  // Check if the user exists
  try {
    const user = await User.findOne({ id });
    if (!user) {
      sendErrorResponse(
        res,
        404,
        'fail',
        'There is no user with the specified id.'
      );
      return;
    }
    // Delete the user
    await User.deleteOne({ id });
    res.status(200).json({
      status: 'success',
      message: `User ${id} deleted successfully`
    });
  } catch (error) {
    sendErrorResponse(res, 500, 'error', 'Internal server error');
  }
};

module.exports = {
  addExpense,
  getAllExpenses,
  removeExpense,
  createUser,
  removeUser,
  removeReport
};
