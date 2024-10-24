import { HTTP_STATUS } from '../common/http-status.common.js';
import Room from '../models/room.model.js';

export const roomApi = {
  // create room
  createRoom: async (req, res) => {
    const { body } = req;

    const room = await Room.create(body);

    if (!room) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Create room faild!', status: false });
    }

    return res.status(HTTP_STATUS.CREATED).json({
      message: 'Create room successfully!',
      status: true,
      data: room,
    });
  },

  // get all room
  getAllRooms: async (req, res) => {
    const { search, _limit, _page } = req.params;

    const options = {
      limit: Number(_limit),
      page: Number(_page),
      sort: { createdAt: -1 },
    };

    const rooms = await Room.paginate({}, options);

    if (!rooms) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Get all rooms failed', success: false });
    }
    return res.status(HTTP_STATUS.OK).json({ message: 'Get all rooms successfully', success: true, ...rooms });
  },
};
