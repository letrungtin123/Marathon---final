import joi from 'joi';

export const brandValidation = joi.object({
  nameBrand: joi.string().required(),
  image: joi.string().required(),
  status: joi.string().valid('active', 'inactive').default('active'),
  country: joi.string().default('Viet Nam'),
  desc: joi.string(),
});
