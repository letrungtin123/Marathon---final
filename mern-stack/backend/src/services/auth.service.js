import User from '../models/user.model.js';

// check email is already exist
export const checkEmailExist = async (email) => {
  const user = await User.findOne({ email });

  return user;
};

// create user
export const createUser = async (data) => {
  const user = await User.create(data);

  return user;
};

// update password
export const updatePassword = async (userId, newPassword) => {
  const newUserUpdate = await User.findByIdAndUpdate({ _id: userId }, { password: newPassword }, { new: true });
  return Boolean(newUserUpdate);
};

// update status user
export const updateStatusUser = async (userId, status) => {
  const newUser = await User.findByIdAndUpdate({ _id: userId }, { status }, { new: true });
  return Boolean(newUser);
};
