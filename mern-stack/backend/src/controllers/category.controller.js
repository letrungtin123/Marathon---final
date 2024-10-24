import {
  createCategoryService,
  deleteCategoryService,
  getAllCategories,
  getCategoryByIdService,
  updateCategoryService,
} from '../services/category.service.js';

import { HTTP_STATUS } from '../common/http-status.common.js';

// create category
export const createCategory = async (req, res) => {
  const body = req.body;

  const newCategory = await createCategoryService(body);
  if (!newCategory) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Create category faild!', success: false });
  }

  return res.status(HTTP_STATUS.OK).json({ message: 'Create category success!', success: true, data: newCategory });
};

// get Categories
export const getCategories = async (req, res) => {
  const { q } = req.query;

  const result = await getAllCategories(q);

  if (!result) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Get categories faild!', success: false });
  }

  return res.status(HTTP_STATUS.OK).json({ message: 'Get categories success!', success: true, data: result });
};

// get category by id
export const getCategoryById = async (req, res) => {
  const { id } = req.params;

  const result = await getCategoryByIdService(id);
  if (!result) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Get cateogry faild!', success: false });
  }

  return res.status(HTTP_STATUS.OK).json({ message: 'Get cateogry success!', success: true, data: result });
};

// update category
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  const result = await updateCategoryService(id, body);
  if (!result) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Update category faild!', success: false });
  }

  return res.status(HTTP_STATUS.OK).json({ message: 'Update category success!', success: true, data: result });
};

// delete category
export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  const result = await deleteCategoryService(id);

  if (!result) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Delete category faild!', success: false });
  }

  return res.status(HTTP_STATUS.OK).json({ message: 'Delete category success!', success: true });
};
