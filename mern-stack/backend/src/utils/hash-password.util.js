import bcrypt from 'bcrypt';

export const handleHashPassword = async ({ password, saltNumber = 10 }) => {
  // hash password
  const salt = await bcrypt.genSalt(saltNumber);
  const hashPassword = await bcrypt.hash(password, salt);

  return hashPassword;
};

export const handleComparePassword = async ({ password, hashPassword }) => {
  return await bcrypt.compare(password, hashPassword);
};
