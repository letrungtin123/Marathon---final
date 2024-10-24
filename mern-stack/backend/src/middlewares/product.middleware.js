import { HTTP_STATUS } from '../common/http-status.common.js';
import { productValidation } from '../validations/product.validation.js';

export const productMiddleware = async (req, res, next) => {
  const body = req.body;

  const { error } = productValidation.validate(body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((item) => item.message);
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: errors, success: false });
  }

  next();
};
