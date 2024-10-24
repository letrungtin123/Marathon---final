import express from 'express';
import { voucherController } from '../controllers/voucher.controller.js';
import { checkPermission } from '../middlewares/check-permission.middleware.js';
import { verifyToken } from '../middlewares/verify-token.middleware.js';
import { voucherMiddleware } from '../middlewares/voucher.middleware.js';
import { wrapRequestHandler } from '../utils/handlers.util.js';

const router = express.Router();

router.post(
  '/voucher',
  wrapRequestHandler(verifyToken),
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(voucherMiddleware),
  wrapRequestHandler(voucherController.createVoucher),
);

// lấy danh sách voucher
router.get('/vouchers', wrapRequestHandler(voucherController.getVouchers));

// update voucher
router.put(
  '/voucher/:id',
  wrapRequestHandler(verifyToken),
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(voucherMiddleware),
  wrapRequestHandler(voucherController.updateVoucher),
);

// xem chi tiết voucher
router.get('/voucher/:id', wrapRequestHandler(voucherController.getVoucherById));

// xóa voucher
router.patch(
  '/voucher/:id',
  wrapRequestHandler(verifyToken),
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(voucherController.deleteVoucher),
);

export default router;
