const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

// connect to MongoDB Atlas database
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.qfueckd.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Failed to connect to MongoDB Atlas", err));

// define the schema for users collection
const userSchema = new mongoose.Schema({
  id: Number,
  first_name: String,
  last_name: String,
  birthday: String,
});

// define the schema for costs collection
const costSchema = new mongoose.Schema({
  user_id: Number,
  year: Number,
  month: Number,
  day: Number,
  description: String,
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
  sum: Number,
});

// define the models for users and costs collections
const User = mongoose.model("User", userSchema);
const Cost = mongoose.model("Cost", costSchema);

// add a user to the database
const user = new User({
  id: 123123,
  first_name: "moshe",
  last_name: "israeli",
  birthday: "January, 10th, 1990",
});
user.save();

// add a new cost item
app.post("/addcost", (req, res) => {
  const { user_id, year, month, day, description, category, sum } = req.body;
  const cost = new Cost({
    user_id,
    year,
    month,
    day,
    description,
    category,
    sum,
  });
  cost
    .save()
    .then((doc) => res.json(doc))
    .catch((err) => res.status(400).json({ error: err.message }));
});

// get a detailed report for a specific month and year
app.get("/report", (req, res) => {
  const { user_id, year, month } = req.query; // FIXME: query or body?
  Cost.find({ user_id, year, month })
    .then((docs) => {
      const report = {
        food: [],
        health: [],
        housing: [],
        sport: [],
        education: [],
        transportation: [],
        other: [],
      };
      docs.forEach((doc) =>
        report[doc.category].push({
          day: doc.day,
          description: doc.description,
          sum: doc.sum,
        })
      );
      res.json(report);
    })
    .catch((err) => res.status(400).json({ error: err.message }));
});

// get information about the developers
app.get("/about", (req, res) => {
  const developers = [
    {
      firstname: "Elad",
      lastname: "Asaf",
      id: process.env.ELAD_ID,
      email: "elad220@gmail.com",
    },
    {
      firstname: "Lidar",
      lastname: "Baruch",
      id: process.env.LIDAR_ID,
      email: "lidarbar220@gmail.com",
    },
  ];
  res.json(developers);
});

// start the server
app.listen(port, () => console.log(`Server listening on port ${port}`));
