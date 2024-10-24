import { HTTP_STATUS } from '../common/http-status.common.js';
import { orderValidation } from '../validations/order.validation.js';

export const orderMiddleware = async (req, res, next) => {
  const body = req.body;

  const { error } = orderValidation.validate(body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((item) => item.message);
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: errors, success: false });
  }

  next();
};
