import {
  changePasswordController,
  getUserInfo,
  getUsers,
  updateProfile,
  updateStatus,
} from '../controllers/user.controller.js';
import { validationChangePassword, validationUpdateProfile } from '../middlewares/user.middleware.js';

import express from 'express';
import { checkPermission } from '../middlewares/check-permission.middleware.js';
import { verifyToken } from '../middlewares/verify-token.middleware.js';
import { wrapRequestHandler } from '../utils/handlers.util.js';

const router = express.Router();

// change password
router.patch(
  '/change-password',
  wrapRequestHandler(verifyToken),
  wrapRequestHandler(validationChangePassword),
  wrapRequestHandler(changePasswordController),
);

// get user info
router.get('/me', wrapRequestHandler(verifyToken), wrapRequestHandler(getUserInfo));

// get users
router.get(
  '/users',
  wrapRequestHandler(verifyToken),
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(getUsers),
);

// update status user
router.patch(
  '/user/:userId/:status',
  wrapRequestHandler(verifyToken),
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(updateStatus),
);

// update profile
router.patch(
  '/me',
  wrapRequestHandler(verifyToken),
  wrapRequestHandler(validationUpdateProfile),
  wrapRequestHandler(updateProfile),
);

export default router;
