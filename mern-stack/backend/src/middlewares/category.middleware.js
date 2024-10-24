import { HTTP_STATUS } from '../common/http-status.common.js';
import { categoryValidation } from '../validations/category.validation.js';

export const categoryMiddleware = (req, res, next) => {
  const body = req.body;

  const { error } = categoryValidation.validate(body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((item) => item.message);
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: errors, success: false });
  }

  next();
};
