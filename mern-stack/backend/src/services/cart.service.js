import Cart from '../models/cart.model.js';

export const cartService = {
  // get carts by userId
  getCartsByUserId: async (query, params) => {
    if (params) {
      return Cart.findOne({ userId: query.userId }).populate([
        {
          path: 'userId',
          select: '_id email avatar fullname phone',
          match: { status: query.status, _id: query.userId },
        },
        { path: 'carts.productId', select: '_id nameProduct price sale images is_deleted status' },
      ]);
    }
    return Cart.findOne({ userId: query.userId });
  },
  // createCart
  createCart: async (userId, carts) => {
    const newCart = new Cart({
      userId,
      carts,
    });

    return newCart.save();
  },
};
