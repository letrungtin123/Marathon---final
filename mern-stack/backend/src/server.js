import * as dotenv from 'dotenv';

import cors from 'cors';
import express from 'express';
import { Server } from 'socket.io';
import swaggerUi from 'swagger-ui-express';
import connectDB from './configs/connect-db.config.js';
import apiDocumention from './docs/apidoc.doc.js';
import Message from './models/message.model.js';
import rootRoutes from './routes/index.js';

dotenv.config();

const app = express();

/* middlewares */
app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:4200'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  }),
);

app.get('/', (_, res) => {
  res.send('Hello World');
});

// connect to MongoDB
connectDB();

// doc swagger
app.use('/documents', swaggerUi.serve, swaggerUi.setup(apiDocumention));

// routes
app.use(`/api/v1`, rootRoutes);


const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// tạo socket
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

io.on('connection', (socket) => {
  // bắt sự kiện khi người dùng tham gia vào room
  socket.on('join-room', (roomId) => {
    socket.join(roomId); // => tham gia room
  });

  socket.on('send-message', async (data) => {
    const newMessage = await Message.create(data);
    if (!newMessage) {
      return io.emit('error-message', { message: 'Send messager failed', success: false });
    }
    io.emit('received-message', newMessage);
  });

  socket.on('disconnect', (roomId) => {
    console.log(socket.rooms);
  });
});
