const User = require("../models/user-model");

// add a user to the database
const createUser = async () => {
  const user_id = 123123;
  const user = await User.findOne({ id: user_id });
  if (!user) {
    const user = await User.create({
      id: user_id,
      first_name: "moshe",
      last_name: "israeli",
      birthday: "January, 10th, 1990",
    });
    user.save();
    console.log("User added successfully");
  } else {
    console.log("User already exists, skipping creation");
  }
};
module.exports = createUser;
