import Joi from 'joi';

export const voucherValidation = Joi.object({
  code: Joi.string().required(),
  discount: Joi.number().integer().required(),
  status: Joi.string().valid('active', 'inactive').default('active'),
  is_deleted: Joi.boolean().default(false),
  desc: Joi.string(),
  startDate: Joi.date(),
  endDate: Joi.date(),
  voucherPrice: Joi.number().integer().default(0),
  applicablePrice: Joi.number().integer().default(0),
  createdBy: Joi.string().required(),
});
