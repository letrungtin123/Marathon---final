import { HTTP_STATUS } from '../common/http-status.common.js';
import { changePasswordValidation } from '../validations/auth.validation.js';
import { updateProfileValidation } from '../validations/user.validattion.js';

export const validationChangePassword = (req, res, next) => {
  const body = req.body;

  // validate
  const { error } = changePasswordValidation.validate(body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((item) => item.message);
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: errors, success: false });
  }

  next();
};

export const validationUpdateProfile = (req, res, next) => {
  const body = req.body;

  const { error } = updateProfileValidation.validate(body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((item) => item.message);
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: errors, success: false });
  }

  next();
};
