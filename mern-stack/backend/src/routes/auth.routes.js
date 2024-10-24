import {
  loginController,
  registerController,
  resetPasswordController,
  sendEmailController,
} from '../controllers/auth.controller.js';
import {
  validationLogin,
  validationRegiser,
  validationResetPassword,
  validationSendEmail,
} from '../middlewares/auth.middleware.js';

import express from 'express';
import { verifyToken } from '../middlewares/verify-token.middleware.js';
import { wrapRequestHandler } from '../utils/handlers.util.js';

const router = express.Router();

// register
router.post('/register', wrapRequestHandler(validationRegiser), wrapRequestHandler(registerController));
// login
router.post('/login', wrapRequestHandler(validationLogin), wrapRequestHandler(loginController));
// send email when user forget password
router.post('/send-email', wrapRequestHandler(validationSendEmail), wrapRequestHandler(sendEmailController));
// reset password
router.put(
  '/reset-password',
  wrapRequestHandler(verifyToken),
  wrapRequestHandler(validationResetPassword),
  wrapRequestHandler(resetPasswordController),
);

export default router;
