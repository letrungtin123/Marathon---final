import dayjs from 'dayjs';
import { HTTP_STATUS } from '../common/http-status.common.js';
import { voucherValidation } from '../validations/voucher.validation.js';

const regex = /^COL\d{10}$/;

export const voucherMiddleware = (req, res, next) => {
  const body = req.body;
  const { code, startDate, endDate } = body;

  const { error } = voucherValidation.validate(body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((item) => item.message);
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: errors, success: false });
  }

  // check code đúng với cái regex đã định nghĩa /^COL\d{10}$/;
  if (!regex.test(code)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Code is invalid', success: false });
  }

  // check startDate và endDate
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  if (start.isAfter(end)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Start date must be before end date', success: false });
  }

  next();
};
