import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const sizeSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
});

const productSchema = new mongoose.Schema(
  {
    nameProduct: {
      type: String,
      required: true,
    },
    sale: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
    },
    desc: {
      type: String,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    sizes: [sizeSchema],
    images: [
      {
        url: {
          type: String,
        },
        public_id: {
          type: String,
        },
      },
    ],
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', productSchema);

export default Product;
