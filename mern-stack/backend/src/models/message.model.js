import MongoosePaginate from 'mongoose-paginate-v2';
import { mongoose } from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

messageSchema.plugin(MongoosePaginate);

const Message = mongoose.model('Message', messageSchema);

export default Message;
