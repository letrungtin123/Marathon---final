import { createBrand, getBrandById, getBrands, updateBrand } from '../controllers/brand.controller.js';

import express from 'express';
import { brandMiddleware } from '../middlewares/brand.middleware.js';
import { checkPermission } from '../middlewares/check-permission.middleware.js';
import { verifyToken } from '../middlewares/verify-token.middleware.js';
import { wrapRequestHandler } from '../utils/handlers.util.js';

const router = express.Router();

// create brand
router.post(
  '/brand',
  wrapRequestHandler(verifyToken),
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(brandMiddleware),
  wrapRequestHandler(createBrand),
);
// get all
router.get('/brand', wrapRequestHandler(getBrands));
// get by id
router.get('/brand/:brandId', wrapRequestHandler(getBrandById));
// update
router.patch(
  '/brand/:brandId',
  wrapRequestHandler(verifyToken),
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(brandMiddleware),
  wrapRequestHandler(updateBrand),
);

export default router;
