const User = require("../models/userModel");

// add a user to the database
const createUser = async () => {
  const user = await User.create({
    id: 123123,
    first_name: "Moshe",
    last_name: "Israeli",
    birthday: "January, 10th, 1990",
  });
  user.save();
  console.log("User added successfully");
};
module.exports = createUser;
