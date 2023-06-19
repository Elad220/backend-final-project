const User = require('../models/user-model');

// add a user to the database
const createUser = async () => {
  const defaultUser = {
    id: 123123,
    first_name: 'moshe',
    last_name: 'israeli',
    birthday: 'January, 10th, 1990'
  };
  const user = await User.findOne({ id: defaultUser.id });
  if (!user) {
    const user = await User.create({
      id: defaultUser.id,
      first_name: defaultUser.first_name,
      last_name: defaultUser.last_name,
      birthday: defaultUser.birthday
    });
    user.save();
    console.log('User added successfully');
  } else {
    console.log('User already exists, skipping creation');
  }
};
module.exports = createUser;
