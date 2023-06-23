const express = require('express');
const router = express.Router();

const {
  addExpense,
  getAllExpenses,
  removeExpense,
  createUser,
  removeUser,
  removeReport
} = require('../controllers/expense-controller');

const {
  removeUsers,
  removeExpenses,
  removeReports
} = require('../controllers/purge-controller');

// Define the developers array
const developers = [
  {
    firstname: 'Elad',
    lastname: 'Asaf',
    id: process.env.ELAD_ID,
    email: 'elad220@gmail.com'
  },
  {
    firstname: 'Lidar',
    lastname: 'Baruch',
    id: process.env.LIDAR_ID,
    email: 'lidarbar220@gmail.com'
  }
];

// setup the routes for the app
// router.get('/report', getAllExpenses);
router.get('/report/', getAllExpenses);
// router.post('/addcost', addExpense);
router.post('/addcost/', addExpense);
router.post('/adduser', createUser);
// router.get('/about', (req, res) => {
//   res.json(developers);
// });
router.get('/about/', (req, res) => {
  res.json(developers);
});
router.delete('/removeuser', removeUser);
router.delete('/removereport', removeReport);
router.delete('/removecost', removeExpense);
router.delete('/purge-user', removeUsers);
router.delete('/purge-expenses', removeExpenses);
router.delete('/purge-reports', removeReports);
module.exports = router;
