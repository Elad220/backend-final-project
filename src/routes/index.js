const express = require("express");
const router = express.Router();

const {
  addExpense,
  getAllExpenses,
} = require("../controllers/expenseController");

const {
  removeUser,
  removeExpenses,
} = require("../controllers/purgeController");

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

router.post("/addcost", addExpense);
router.get("/report", getAllExpenses);
router.get("/about", (req, res) => {
  res.json(developers);
});
router.post("/purge-user", removeUser);
router.post("/purge-expenses", removeExpenses);
module.exports = router;
