import MongoosePaginate from 'mongoose-paginate-v2';
import { mongoose } from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    name: {
      type: String,
      required: true,
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

roomSchema.plugin(MongoosePaginate);

const Room = mongoose.model('Room', roomSchema);

export default Room;
