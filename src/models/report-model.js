const mongoose = require('mongoose');

// Define the schema for reports collection
const reportSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  data: { type: Object, required: true }
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
