import Voucher from '../models/voucher.model.js';

export const voucherService = {
  // create
  createVoucher: async (body) => {
    return await Voucher.create(body);
  },

  updateVoucher: async (id, body) => {
    return await Voucher.findByIdAndUpdate({ _id: id }, body, { new: true });
  },

  // tìm kiếm voucher theo id
  findVoucherById: async (id) => {
    return await Voucher.findById(id);
  },

  // get all vouchers
  getVouchers: async (query) => {
    return await Voucher.find(query);
  },
};
