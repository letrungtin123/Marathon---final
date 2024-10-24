import mongoose from 'mongoose';

const BrandSchema = new mongoose.Schema(
  {
    nameBrand: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'active',
      enum: ['active', 'inactive'],
    },
    country: {
      type: String,
      default: 'Viet Nam',
    },
    desc: {
      type: String,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Brand = mongoose.model('Brand', BrandSchema);

export default Brand;
