import { HTTP_STATUS } from '../common/http-status.common.js';
import { roomValidation } from '../validations/room.validation.js';

export const roomMiddleware = async (req, res, next) => {
  const body = req.body;

  const { error } = roomValidation.validate(body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((item) => item.message);
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: errors, success: false });
  }

  next();
};
