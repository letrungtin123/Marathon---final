import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
  {
    nameCategory: {
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

const Category = mongoose.model('Category', CategorySchema);

export default Category;
