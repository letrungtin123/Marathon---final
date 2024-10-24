import Joi from 'joi';

export const orderValidation = Joi.object({
  userId: Joi.string().required().messages({
    'any.required': 'userId is required',
    'string.empty': 'userId is not allowed to be empty',
  }),
  status: Joi.string().valid('pending', 'confirmed', 'delivery', 'completed', 'cancelled').required().messages({
    'any.required': 'status is required',
    'string.empty': 'status is not allowed to be empty',
  }),
  note: Joi.string().messages({
    'string.empty': 'note is not allowed to be empty',
  }),
  paymentMethod: Joi.string().valid('cod', 'payment').required().messages({
    'any.required': 'payment is required',
    'string.empty': 'payment is not allowed to be empty',
  }),
  total: Joi.number().required().messages({
    'any.required': 'total is required',
    'number.base': 'total must be a number',
  }),
  products: Joi.array().items(
    Joi.object({
      productId: Joi.string().required().messages({
        'any.required': 'productId is required',
        'string.empty': 'productId is not allowed to be empty',
      }),
      quantity: Joi.number().required().messages({
        'any.required': 'quantity is required',
        'number.base': 'quantity must be a number',
      }),
      size: Joi.string().required().messages({
        'any.required': 'size is required',
        'string.empty': 'size is not allowed to be empty',
      }),
      color: Joi.string().required().messages({
        'any.required': 'color is required',
        'string.empty': 'color is not allowed to be empty',
      }),
      price: Joi.number().required().messages({
        'any.required': 'price is required',
        'number.base': 'price must be a number',
      }),
    }),
  ),
  infoOrderShipping: Joi.object({
    name: Joi.string().required().messages({
      'any.required': 'name is required',
      'string.empty': 'name is not allowed to be empty',
    }),
    phone: Joi.string().required().messages({
      'any.required': 'phone is required',
      'string.empty': 'phone is not allowed to be empty',
    }),
    address: Joi.string().required().messages({
      'any.required': 'address is required',
      'string.empty': 'address is not allowed to be empty',
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Email không hợp lệ',
      'any.required': 'Email không được để trống',
      'string.empty': 'Email không được để trống',
    }),
  }),
  priceShipping: Joi.number().required().messages({
    'any.required': 'priceShipping is required',
    'number.base': 'priceShipping must be a number',
  }),
  voucher: Joi.string().allow(null, ''),
});
