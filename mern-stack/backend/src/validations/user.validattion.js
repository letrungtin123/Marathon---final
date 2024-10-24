import joi from 'joi';

export const updateProfileValidation = joi.object({
  fullname: joi.string().required().messages({
    'string.base': 'Fullname must be a string',
    'string.empty': 'Fullname is required',
    'any.required': 'Fullname is required',
  }),
  phone: joi.string().required().messages({
    'string.base': 'Phone must be a string',
    'string.empty': 'Phone is required',
    'any.required': 'Phone is required',
  }),
  address: joi.string().required().messages({
    'string.base': 'Address must be a string',
    'string.empty': 'Address is required',
    'any.required': 'Address is required',
  }),
  avatar: joi.string().required().messages({
    'string.base': 'Avatar must be a string',
    'string.empty': 'Avatar is required',
    'any.required': 'Avatar is required',
  }),
});
