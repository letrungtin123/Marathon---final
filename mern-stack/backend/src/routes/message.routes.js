import express from 'express';
import { messageApi } from '../controllers/messages.controller.js';
import { verifyToken } from '../middlewares/verify-token.middleware.js';
import { wrapRequestHandler } from '../utils/handlers.util.js';

const router = express.Router();

router.get('/messagers/:roomId', wrapRequestHandler(verifyToken), wrapRequestHandler(messageApi.getAllMessageByRoomId));
router.post('/messagers', wrapRequestHandler(verifyToken), wrapRequestHandler(messageApi.createMesasger));

export default router;
