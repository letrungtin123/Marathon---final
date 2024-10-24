import { checkEmailExist, updatePassword, updateStatusUser } from '../services/auth.service.js';
import { handleComparePassword, handleHashPassword } from '../utils/hash-password.util.js';

import { HTTP_STATUS } from '../common/http-status.common.js';
import User from '../models/user.model.js';
import { updateUserService } from '../services/user.service.js';

export const changePasswordController = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { email } = req.user;

  // hash password
  const [_, newPassword2] = await Promise.all([
    handleHashPassword({ password: oldPassword, saltNumber: 5 }),
    handleHashPassword({ password: newPassword, saltNumber: 5 }),
  ]);

  // check email
  const user = await checkEmailExist(email);
  if (!user) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Email not found!', success: false });
  }

  // compare password
  const isMatch = await handleComparePassword({ password: oldPassword, hashPassword: user.password });
  if (!isMatch) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Password not match!', success: false });
  }

  // update password
  const result = await updatePassword(user._id, newPassword2);
  if (!result) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Update password faild!', success: false });
  }

  return res.status(HTTP_STATUS.OK).json({
    message: 'Update password success!',
    success: true,
  });
};

// get user info
export const getUserInfo = async (req, res) => {
  const { _id } = req.user;

  const userInfo = await User.findById(_id);
  if (!userInfo) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Get info faild!', success: false });
  }

  const { password, status, ...rest } = userInfo._doc;

  return res.status(HTTP_STATUS.OK).json({ message: 'Get user success!', success: true, data: rest });
};

// get users
export const getUsers = async (req, res) => {
  const { _page = 1, _limit = 5, q, role, status } = req.query;

  const options = {
    page: _page,
    limit: _limit,
  };

  let query = {};

  if (q) {
    query = {
      $and: [
        {
          $or: [
            { email: { $regex: new RegExp(q), $options: 'i' } },
            {
              role: { $regex: new RegExp(q), $options: 'i' },
            },
          ],
        },
      ],
    };
  }

  if (role) {
    query = {
      ...query,
      role,
    };
  }

  if (status) {
    query = {
      ...query,
      status,
    };
  }

  const users = await User.paginate(query, options);

  if (!users) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Get users faild!', success: false });
  }

  return res.status(HTTP_STATUS.OK).json({ message: 'Get users success!', success: true, ...users });
};

// update status
export const updateStatus = async (req, res) => {
  const { userId, status } = req.params;

  const result = await updateStatusUser(userId, status);
  if (!result) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Update status faild!', success: false });
  }

  return res.status(HTTP_STATUS.OK).json({ message: 'Update status success!', success: true });
};

// update profile
export const updateProfile = async (req, res) => {
  const { _id } = req.user;
  const body = req.body;

  const user = await updateUserService(_id, body);
  if (!user) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Update profile faild!', success: false });
  }

  return res.status(HTTP_STATUS.OK).json({ message: 'Update profile success!', success: true });
};
