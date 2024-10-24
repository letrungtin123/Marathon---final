import mongoose from 'mongoose';
import { HTTP_STATUS } from '../common/http-status.common.js';
import Product from '../models/product.model.js';
import { productService } from '../services/product.service.js';

export const productController = {
  optionProduct: (params) => {
    const { _limit = 10, _page = 1, q, populate, rest } = params;

    let populateDefault = [
      {
        path: 'category',
        select: '_id nameCategory image desc',
      },
      {
        path: 'brand',
        select: '_id nameBrand image desc',
      },
    ];
    if (populate) {
      if (Array.isArray(populate)) {
        populateDefault = [...populateDefault, ...populate];
      } else {
        populateDefault.push(populate);
      }
    }
    let query = {};
    if (q) {
      query = {
        $and: [
          {
            $or: [{ nameProduct: { $regex: new RegExp(q), $options: 'i' } }],
          },
        ],
      };
    }
    // filter status
    if (rest.status) {
      query = {
        ...query,
        status: rest.status,
      };
    }
    // filter deleted
    if (rest.deleted) {
      query = {
        ...query,
        is_deleted: rest.deleted === 'true' ? true : false,
      };
    }
    // filter category
    if (rest.category) {
      query = {
        ...query,
        category: rest.category,
      };
    }
    // filter brand
    if (rest.brand) {
      query = {
        ...query,
        brand: rest.brand,
      };
    }

    const option = {
      limit: parseInt(_limit),
      page: parseInt(_page),
      populate: populateDefault,
      sort: { createdAt: -1 },
    };
    return { option, query };
  },
  // check id product invalid
  checkIdProductInvalid: async (req, res) => {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Id product invalid', success: false });
    }
    return true;
  },
  // check product exist
  checkProductExist: async (req, res) => {
    const { productId } = req.params;

    const productExist = await productService.getProductById(productId);
    if (!productExist) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Product not found', success: false });
    }
    return productExist;
  },
  // xoá product_id trong category và brand cũ
  removeProductFromCateAndBrand: async (productId, categoryId, brandId) => {
    const [resultCategory, resultBrand] = await Promise.all([
      productService.addProductToCategory(productId, categoryId),
      productService.addProductToBrand(productId, brandId),
    ]);
    return { resultCategory, resultBrand };
  },

  // add product
  addProduct: async (req, res) => {
    const body = req.body;

    // add product
    const product = await productService.addProduct(body);
    if (!product) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Add product failed', success: false });
    }

    // add productId vào product của category và brand tương ứng
    await Promise.all([
      productService.addProductToCategory(product._id, product.category),
      productService.addProductToBrand(product._id, product.brand),
    ]);

    return res.status(HTTP_STATUS.OK).json({ message: 'Add product successfully', success: true, data: product });
  },
  // get all product
  getAllProduct: async (req, res) => {
    const { _limit = 10, _page = 1, q, ...rest } = req.query;
    const { option, query } = productController.optionProduct({
      _limit,
      _page,
      q,
      rest,
    });

    const products = await productService.getAllProduct(option, query);
    if (!products) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Get all products failed', success: false });
    }
    return res.status(HTTP_STATUS.OK).json({ message: 'Get all product successfully', success: true, ...products });
  },
  // get product by id
  getProductById: async (req, res) => {
    const { id } = req.params;

    const product = await productService.getProductById(id);
    if (!product) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Get product failed', success: false });
    }

    return res.status(HTTP_STATUS.OK).json({ message: 'Get product successfully', success: true, data: product });
  },
  // get product with status
  getProductWithStatus: async (req, res) => {
    const { status, deleted } = req.params;
    const { _limit = 10, _page = 1, q } = req.query;
    const { option, query } = productController.optionProduct({
      _limit,
      _page,
      q,
      status,
      deleted,
    });

    const products = await productService.getAllProduct(option, query);
    if (!products) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Get all products failed', success: false });
    }
    return res.status(HTTP_STATUS.OK).json({ message: 'Get all product successfully', success: true, ...products });
  },
  // update status
  updateStatus: async (req, res) => {
    const { productId } = req.params;
    const { is_deleted, status } = req.query;

    if (!is_deleted || !status) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: 'Update is_deleted and status failed', success: false });
    }

    const deleted = is_deleted === 'true' ? true : false;
    const statusProduct = status === 'active' ? 'active' : 'inactive';

    if (is_deleted) {
      const product = await productService.updateDeleted(productId, deleted);
      if (!product) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Update is_deleted failed', success: false });
      }

      return res
        .status(HTTP_STATUS.OK)
        .json({ message: 'Update is_deleted successfully', success: true, data: product });
    }

    const product = await productService.updateStatus(productId, statusProduct);
    if (!product) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Update status failed', success: false });
    }

    return res.status(HTTP_STATUS.OK).json({ message: 'Update status successfully', success: true, data: product });
  },
  // update product
  updateProduct: async (req, res) => {
    const { productId } = req.params;
    const body = req.body;

    // check product exist
    const productExist = await productController.checkProductExist(req, res);

    // xoas product_id trong category và brand cũ
    // await Promise.all([
    //   productService.removeProductFromCategory(productId, productExist.category._id),
    //   productService.removeProductFromBrand(productId, productExist.brand._id),
    // ]);
    await productController.removeProductFromCateAndBrand(productId, productExist.category._id, productExist.brand._id);

    // update product
    const product = await productService.updateProduct(productId, body);
    if (!product) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Update product failed', success: false });
    }

    // add productId vào product của category và brand tương ứng
    await Promise.all([
      productService.addProductToCategory(product._id, product.category),
      productService.addProductToBrand(product._id, product.brand),
    ]);

    return res.status(HTTP_STATUS.OK).json({ message: 'Update product successfully', success: true, data: product });
  },
  // delete product
  deleteProduct: async (req, res) => {
    const { productId } = req.params;

    // check id product invalid
    await productController.checkIdProductInvalid(req, res);

    // check product exist
    const productExist = await productController.checkProductExist(req, res);

    // xoas product_id trong category và brand cũ
    const result = await productController.removeProductFromCateAndBrand(
      productId,
      productExist.category._id,
      productExist.brand._id,
    );

    // delete product
    if (!result) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Delete product failed', success: false });
    }

    const productDelete = await productService.deleteProduct(productId);
    if (!productDelete) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Delete product failed', success: false });
    }

    return res.status(HTTP_STATUS.OK).json({ message: 'Delete product successfully', success: true });
  },

  // delete mutiple
  deleteMultiple: async (req, res) => {
    const { id: ids } = req.query;

    if (!ids || !ids.length) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Ids invalid', success: false });
    }

    // check id product invalid
    const checkIds = ids.map((id) => {
      return mongoose.Types.ObjectId.isValid(id);
    });

    // include
    if (checkIds.includes(false)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Ids invalid', success: false });
    }

    const result = await Product.deleteMany({ _id: { $in: ids } });
    if (!result) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: 'Delete multiple failed', success: false, status: HTTP_STATUS.BAD_REQUEST });
    }

    return res
      .status(HTTP_STATUS.OK)
      .json({ message: 'Delete multiple successfully', success: true, status: HTTP_STATUS.OK });
  },

  // update many
  updateManyProduct: async (req, res) => {
    const { id: ids, deleted } = req.query;
    if (!ids || !ids.length) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Ids invalid', success: false });
    }

    const idsArray = Array.isArray(ids) ? ids : [ids];

    // check id product invalid
    const checkIds = idsArray.map((id) => {
      return mongoose.Types.ObjectId.isValid(id);
    });
    // include
    if (checkIds.includes(false)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Ids invalid', success: false });
    }

    // update many id field is_deleted = true
    const result = await Product.updateMany({ _id: { $in: idsArray } }, { is_deleted: deleted || true }, { new: true });

    if (!result) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: 'Update many failed', success: false, status: HTTP_STATUS.BAD_REQUEST });
    }

    return res.status(HTTP_STATUS.OK).json({
      message: deleted ? 'Restore product success!' : 'Update many successfully',
      success: true,
      status: HTTP_STATUS.OK,
    });
  },
};
