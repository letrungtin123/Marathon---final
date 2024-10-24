import Brand from '../models/brand.model.js';
import Category from '../models/category.model.js';
import Product from '../models/product.model.js';

export const productService = {
  // add product
  addProduct: async (body) => {
    return await Product.create(body);
  },
  // get all product
  getAllProduct: async (option, query) => {
    return await Product.paginate(query, option);
  },
  // get product by id
  getProductById: async (id) => {
    return await Product.findById(id).populate([
      {
        path: 'category',
        select: '_id nameCategory image desc',
      },
      {
        path: 'brand',
        select: '_id nameBrand image desc',
      },
    ]);
  },
  // update status
  updateStatus: async (productId, status) => {
    return await Product.findByIdAndUpdate({ _id: productId }, { status }, { new: true });
  },
  // update is_deleted
  updateDeleted: async (productId, is_deleted) => {
    return await Product.findByIdAndUpdate({ _id: productId }, { is_deleted }, { new: true });
  },
  // update product
  updateProduct: async (productId, body) => {
    return await Product.findByIdAndUpdate({ _id: productId }, body, { new: true });
  },
  // add product_id to category
  addProductToCategory: async (productId, categoryId) => {
    return await Category.findByIdAndUpdate({ _id: categoryId }, { $addToSet: { products: productId } }, { new: true });
  },
  // add product_id to brand
  addProductToBrand: async (productId, brandId) => {
    return await Brand.findByIdAndUpdate({ _id: brandId }, { $addToSet: { products: productId } }, { new: true });
  },
  // remove product_id from category
  removeProductFromCategory: async (productId, categoryId) => {
    return await Category.findByIdAndUpdate({ _id: categoryId }, { $pull: { products: productId } }, { new: true });
  },
  // remove product_id from brand
  removeProductFromBrand: async (productId, brandId) => {
    return await Brand.findByIdAndUpdate({ _id: brandId }, { $pull: { products: productId } }, { new: true });
  },
  // delete product
  deleteProduct: async (productId) => {
    return await Product.findByIdAndDelete(productId);
  },

  // update quantity product when order
  updateQuantityProduct: async (productId, sizeId, quantity) => {
    return await Product.findOneAndUpdate(
      { _id: productId, 'sizes._id': sizeId },
      { $set: { 'sizes.$.quantity': quantity } }, // sizes.$.quantity: giải thích cụ thể ở dòng 64: https://docs.mongodb.com/manual/reference/operator/update/positional-filtered/#up._S_
      { new: true },
    );
  },
};
