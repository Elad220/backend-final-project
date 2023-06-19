const Counter = require('../models/counter-model');

const getNextSequenceValue = async function (modelName, fieldName) {
  const counter = await Counter.findOneAndUpdate(
    { model: modelName, field: fieldName },
    { $inc: { count: 1 } },
    { new: true, upsert: true }
  );

  return counter.count;
};

module.exports = getNextSequenceValue;
