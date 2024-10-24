import express from 'express';
import { productController } from '../controllers/product.controller.js';
import { checkPermission } from '../middlewares/check-permission.middleware.js';
import { productMiddleware } from '../middlewares/product.middleware.js';
import { verifyToken } from '../middlewares/verify-token.middleware.js';
import { wrapRequestHandler } from '../utils/handlers.util.js';

const router = express.Router();

router.post(
  '/product',
  wrapRequestHandler(verifyToken),
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(productMiddleware),
  wrapRequestHandler(productController.addProduct),
);

// router to get all products
router.get('/products', wrapRequestHandler(productController.getAllProduct));
// router to get product by id
router.get('/product/:id', wrapRequestHandler(productController.getProductById));
// router get product with status
router.get('/products/:status/:deleted', wrapRequestHandler(productController.getProductWithStatus));
// router update status
router.patch(
  '/product/:productId',
  wrapRequestHandler(verifyToken),
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(productController.updateStatus),
);

// router update product
router.put(
  '/product/:productId',
  wrapRequestHandler(verifyToken),
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(productMiddleware),
  wrapRequestHandler(productController.updateProduct),
);

// router delete product
router.delete(
  '/product/:productId',
  wrapRequestHandler(verifyToken),
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(productController.deleteProduct),
);

// xoá cứng nhiều sản phẩm
router.delete(
  `/product-delete-multiple`,
  wrapRequestHandler(verifyToken),
  wrapRequestHandler(checkPermission),
  productController.deleteMultiple,
);

// xoá mềm nhiều sản phẩm
router.patch(
  `/product-delete-multiple`,
  wrapRequestHandler(verifyToken),
  wrapRequestHandler(checkPermission),
  productController.updateManyProduct,
);

export default router;
