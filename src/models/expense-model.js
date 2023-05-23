const mongoose = require("mongoose");

// Define the schema for costs collection
const costSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, "Cost must have an id"],
  },
  user_id: {
    type: Number,
    required: [true, "Cost must have a user id"],
    index: true,
  },
  year: {
    type: Number,
    required: [true, "Cost must have a year"],
    index: true,
  },
  month: {
    type: Number,
    required: [true, "Cost must have a month"],
    index: true,
  },
  day: { type: Number, required: [true, "Cost must have a day"] },
  description: {
    type: String,
    required: [true, "Cost must have a description"],
  },
  category: {
    type: String,
    enum: [
      "food",
      "health",
      "housing",
      "sport",
      "education",
      "transportation",
      "other",
    ],
  },
  sum: { type: Number, required: [true, "Cost must have a sum"] },
});

// Define the model for costs collection
const Cost = mongoose.model("Cost", costSchema);
Cost.createIndexes();

module.exports = Cost;
