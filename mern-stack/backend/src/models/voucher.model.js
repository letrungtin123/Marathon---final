import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

// coolmate
// COL1234567890

// regex:
// cắt chuỗi thành 2 phần: 1 phần là 3 chữ cái đầu tiên, 1 phần là 10 chữ số =>
// check startDate và endDate

const VoucherSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      default: 'active',
      enum: ['active', 'inactive'],
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    // mệnh giá của voucher
    voucherPrice: {
      type: Number,
      default: 0,
    },
    // số tiền tối thiểu có thể sử dụng được voucher này
    applicablePrice: {
      type: Number,
      default: 0,
    },
    // ai tạo voucher này
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

VoucherSchema.plugin(mongoosePaginate);

const Voucher = mongoose.model('Voucher', VoucherSchema);

export default Voucher;
