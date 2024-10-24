import {
  createBrandService,
  getAllBrands,
  getBrandByIdService,
  updateBrandService,
} from '../services/brand.service.js';

import { HTTP_STATUS } from '../common/http-status.common.js';

// create brand
export const createBrand = async (req, res) => {
  const body = req.body;

  const newBrand = await createBrandService(body);
  if (!newBrand) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Create brand faild!', success: false });
  }

  return res.status(HTTP_STATUS.OK).json({ message: 'Create brand success!', success: true, brand: newBrand });
};

// get brands
export const getBrands = async (_, res) => {
  const result = await getAllBrands();

  if (!result) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Get brands faild!', success: false });
  }

  return res.status(HTTP_STATUS.OK).json({ message: 'Get brands success!', success: true, data: result });
};

// get brand by id
export const getBrandById = async (req, res) => {
  const { brandId } = req.params;

  const result = await getBrandByIdService(brandId);
  if (!result) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Get brand faild!', success: false });
  }

  return res.status(HTTP_STATUS.OK).json({ message: 'Get brand success!', success: true, data: result });
};

// update brand
export const updateBrand = async (req, res) => {
  const { brandId } = req.params;
  const body = req.body;

  const result = await updateBrandService(brandId, body);
  if (!result) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Update brand faild!', success: false });
  }

  return res.status(HTTP_STATUS.OK).json({ message: 'Update brand success!', success: true, data: result });
};
