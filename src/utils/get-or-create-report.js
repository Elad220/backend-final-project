const Report = require('../models/report-model');
const Expense = require('../models/expense-model');

async function getOrCreateReport(userId, year, month, validCategories) {
  let report = await Report.findOne({ user_id: userId, year, month });

  if (!report) {
    // Get all expenses for the given month and year of the user
    const expenses = await Expense.find({ month, year, user_id: userId });

    // Initialize report data with empty lists for all categories
    const reportData = validCategories.reduce((acc, category) => {
      acc[category] = [];
      return acc;
    }, {});

    // Format the expenses into report data
    expenses.forEach((expense) => {
      const { day, description, sum, category } = expense;
      const expenseData = { day, description, sum };
      reportData[category].push(expenseData);
    });

    report = new Report({ user_id: userId, year, month, data: reportData });
    await report.save();
  }

  return report;
}

module.exports = getOrCreateReport;
