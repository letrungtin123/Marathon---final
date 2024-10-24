import * as dotenv from 'dotenv';

import { checkEmailExist, createUser, updatePassword } from '../services/auth.service.js';
import { handleComparePassword, handleHashPassword } from '../utils/hash-password.util.js';

import { HTTP_STATUS } from '../common/http-status.common.js';
import { handleGenenateToken } from '../utils/jwt.util.js';

dotenv.config();

export const registerController = async (req, res) => {
  const body = req.user;

  // check email
  const user = await checkEmailExist(body.email);
  if (user) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Email already exist', success: false });
  }

  // hash password
  const hashPassword = await handleHashPassword({ password: body.password, saltNumber: 5 });

  // creaet user in db
  const newUser = await createUser({ ...body, password: hashPassword });

  if (!newUser) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'User not created', success: false });
  }

  // generate token
  const accessToken = await handleGenenateToken({ payload: { _id: newUser._id, email: newUser.email } });

  return res.status(HTTP_STATUS.CREATED).json({
    message: 'User created successfully',
    success: true,
    accessToken,
  });
};

export const loginController = async (req, res) => {
  const body = req.user;

  // check email
  const user = await checkEmailExist(body.email);
  if (!user) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Email not found!', success: false });
  }

  // compare password
  const isMatch = await handleComparePassword({ password: body.password, hashPassword: user.password });
  if (!isMatch) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Password not match!', success: false });
  }

  // generate token
  const accessToken = await handleGenenateToken({ payload: { _id: user._id, email: user.email, role: user.role } });

  return res.status(HTTP_STATUS.OK).json({
    message: 'Login successfully',
    success: true,
    accessToken,
  });
};

// send email
export const sendEmailController = async (req, res) => {
  const { email } = req.email;

  // check email
  const user = await checkEmailExist(email);
  if (user) {
    // generate token
    const accessToken = await handleGenenateToken({
      payload: { email: user.email },
      secretKey: process.env.SEND_EMAIL_SECRET_KEY,
      expiresIn: '1h',
    });

    // link reset password
    const link = `${process.env.URL_SERVER}/reset-password?token=${accessToken}`;
    // send email

    return res.status(HTTP_STATUS.OK).json({
      message: 'Email sent successfully',
      success: true,
      link,
    });
  }
};

// reset password
export const resetPasswordController = async (req, res) => {
  const { newPassword } = req.forgotPassword;
  const { email } = req.user;

  // hash password
  const hashPassword = await handleHashPassword({ password: newPassword });

  // check email
  const user = await checkEmailExist(email);
  if (!user) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Email not found!', success: false });
  }

  // update password
  const result = await updatePassword(user._id, hashPassword);
  if (!result) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Update password faild!', success: false });
  }

  return res.status(HTTP_STATUS.OK).json({
    message: 'Update password success!',
    success: true,
  });
};

// login
// const {password, ...userInfo} = user => return userInfo => resfull api
// const {} =>
