import Brand from '../models/brand.model.js';

export const createBrandService = async (body) => {
  const newBrand = await Brand.create(body);

  return newBrand;
};

// get all brands
export const getAllBrands = async () => {
  const brands = await Brand.find();

  return brands;
};

// get brand by id
export const getBrandByIdService = async (brandId) => {
  const brand = await Brand.findById({ _id: brandId });

  return brand;
};

// update brand
export const updateBrandService = async (brandId, body) => {
  const brand = await Brand.findByIdAndUpdate({ _id: brandId }, body, { new: true });
  return brand;
};
