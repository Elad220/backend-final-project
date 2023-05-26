const mongoose = require("mongoose");
const getNextSequenceValue = require("../utils/auto-increment");

// Define the schema for costs collection
const costSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
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

costSchema.pre("save", async function (next) {
  if (!this.id) {
    this.id = await getNextSequenceValue("Cost", "id");
  }
  next();
});

// Define the model for costs collection
const Cost = mongoose.model("Cost", costSchema);
Cost.createIndexes();

module.exports = Cost;
