import { HTTP_STATUS } from '../common/http-status.common.js';
import Message from '../models/message.model.js';

export const messageApi = {
  // get all messsage by room id
  getAllMessageByRoomId: async (req, res) => {
    const { search, _limit, _page, roomId } = req.params;

    const options = {
      limit: Number(_limit) || 1000,
      page: Number(_page),
      // sort: { createdAt: -1 },
      populate: [
        { path: 'room', select: '_id name createdAt updatedAt' },
        { path: 'sender', select: 'email _id' },
      ],
    };
    const messagers = await Message.paginate({}, options);

    if (!messagers) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Get all messagers failed', success: false });
    }
    return res.status(HTTP_STATUS.OK).json({ message: 'Get all messagers successfully', success: true, ...messagers });
  },

  // create messager
  createMesasger: async (req, res) => {
    const body = req.body;

    const newMessage = await Message.create(body);

    if (!newMessage) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Send messager failed', success: false });
    }
    return res.status(HTTP_STATUS.OK).json({ message: 'Send messager successfully', success: true, data: newMessage });
  },
};
