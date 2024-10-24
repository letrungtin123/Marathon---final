import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    carts: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        color: {
          type: String,
          required: true,
        },
        size: {
          type: String,
          required: true,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

cartSchema.plugin(mongoosePaginate);

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;

// findByIdAndUpdate, updateMany
/*

{
  "_id": string
  "nameBrand":string
  "image": string
  "status"string
  "country":string
  "desc": string
  "createdAt": string
  "updatedAt": string
}
  => {_id, image, nameBrand, status}

*/
