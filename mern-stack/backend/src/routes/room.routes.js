import express from 'express';
import { roomApi } from '../controllers/room.controller.js';
import { roomMiddleware } from '../middlewares/room.middleware.js';
import { wrapRequestHandler } from '../utils/handlers.util.js';

const router = express.Router();

// tạo mới room
router.post('/room', wrapRequestHandler(roomMiddleware), wrapRequestHandler(roomApi.createRoom));
router.get('/rooms', wrapRequestHandler(roomApi.getAllRooms));

export default router;
