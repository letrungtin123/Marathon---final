import Order from '../models/order.model.js';

export const orderService = {
  // createOrder
  createOrder: async (body) => {
    return await Order.create(body);
  },

  // getOrdersByUserId
  getOrdersByUserId: async (userId) => {
    return await Order.find({ userId }).populate([
      { path: 'products.productId', select: '_id nameProduct desc images' },
      { path: 'userId', select: '_id email' },
      { path: 'assignee' },
    ]);
  },

  // get all orders
  getAllOrders: async (query, option) => {
    return await Order.paginate(query, option);
  },

  // get order by id
  getOrderById: async (orderId) => {
    return await Order.findById(orderId).populate([
      { path: 'products.productId', select: '_id nameProduct desc images' },
      { path: 'userId', select: '_id email' },
      { path: 'assignee', select: '_id email avatar role status' },
    ]);
  },

  // update order
  updateOrder: async (_id, body) => {
    return await Order.findByIdAndUpdate(_id, body, { new: true });
  },
};
