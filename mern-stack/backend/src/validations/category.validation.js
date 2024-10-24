import joi from 'joi';

export const categoryValidation = joi.object({
  nameCategory: joi.string().required(),
  image: joi.string().required(),
  status: joi.string().valid('active', 'inactive').default('active'),
  desc: joi.string(),
});
