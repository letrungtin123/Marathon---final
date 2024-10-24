import Joi from 'joi';

export const roomValidation = Joi.object({
  users: Joi.array().items(Joi.string()).required(),
  name: Joi.string().required(),
});
