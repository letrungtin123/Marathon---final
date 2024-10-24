import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from '../controllers/category.controller.js';

import { categoryMiddleware } from '../middlewares/category.middleware.js';
import { checkPermission } from '../middlewares/check-permission.middleware.js';
import express from 'express';
import { verifyToken } from '../middlewares/verify-token.middleware.js';
import { wrapRequestHandler } from '../utils/handlers.util.js';

const router = express.Router();

// create brand
router.post(
  '/category',
  wrapRequestHandler(verifyToken),
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(categoryMiddleware),
  wrapRequestHandler(createCategory),
);
// get all
router.get('/categories', wrapRequestHandler(getCategories));
// get by id
router.get('/category/:id', wrapRequestHandler(getCategoryById));
// update
router.patch(
  '/category/:id',
  wrapRequestHandler(verifyToken),
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(updateCategory),
);

// delete
router.delete(
  '/category/:id',
  wrapRequestHandler(verifyToken),
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(deleteCategory),
);

export default router;
