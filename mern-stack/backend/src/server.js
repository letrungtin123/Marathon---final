import * as dotenv from 'dotenv';

import cors from 'cors';
import express from 'express';
import { Server } from 'socket.io';
import swaggerUi from 'swagger-ui-express';
import connectDB from './configs/connect-db.config.js';
import apiDocumention from './docs/apidoc.doc.js';
import Message from './models/message.model.js';
import rootRoutes from './routes/index.js';
import crypto from 'crypto';
import querystring from 'querystring';

dotenv.config();

const app = express();

app.post('http://localhost:8080/api/v1/create_payment_url', (req, res) => {
  const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  const tmnCode = process.env.VNP_TMN_CODE; // Lấy mã website từ file .env
  const secretKey = process.env.VNP_HASH_SECRET; // Lấy chuỗi bí mật từ file .env
  const vnpUrl = process.env.VNP_URL; // URL sandbox hoặc production của VNPay
  const returnUrl = process.env.VNP_RETURN_URL; // URL trả về sau thanh toán

  const date = new Date();
  const createDate = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date
    .getDate()
    .toString()
    .padStart(2, '0')}${date.getHours().toString().padStart(2, '0')}${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}`;

  const orderId = date.getTime();
  const amount = req.body.amount;
  const bankCode = req.body.bankCode;

  const orderInfo = req.body.orderDescription;
  const orderType = req.body.orderType || 'other';
  const locale = req.body.language || 'vn';

  const vnp_Params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: tmnCode,
    vnp_Locale: locale,
    vnp_CurrCode: 'VND',
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: orderType,
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };
  if (!tmnCode || !secretKey || !vnpUrl || !returnUrl) {
  throw new Error("VNPay configuration missing in environment variables.");
}
  if (bankCode) {
    vnp_Params['vnp_BankCode'] = bankCode;
  }

  // Sắp xếp key theo thứ tự alphabet
  const sortedParams = Object.keys(vnp_Params)
    .sort()
    .reduce((acc, key) => {
      acc[key] = vnp_Params[key];
      return acc;
    }, {});

  const signData = querystring.stringify(sortedParams, { encode: false });
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  if (secureHash === signed) {
    res.json({ code: '00', message: 'success', data: vnp_Params });
  } else {
    res.json({ code: '97', message: 'Invalid signature' });
  }
  if (secureHash !== signed) {
    console.error('Invalid secure hash:', { expected: secureHash, actual: signed });
  }

  sortedParams['vnp_SecureHash'] = signed;
  const paymentUrl = vnpUrl + '?' + querystring.stringify(sortedParams, { encode: false });

  res.json({ paymentUrl });
});

app.get('http://localhost:8080/api/v1/vnpay_return', (req, res) => {
  const vnp_Params = req.query;
  const secureHash = vnp_Params['vnp_SecureHash'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  const sortedParams = Object.keys(vnp_Params)
    .sort()
    .reduce((acc, key) => {
      acc[key] = vnp_Params[key];
      return acc;
    }, {});

  const secretKey = process.env.VNP_HASH_SECRET;
  const signData = querystring.stringify(sortedParams, { encode: false });
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  if (secureHash === signed) {
    // Thanh toán thành công
    res.json({ code: '00', message: 'success', data: vnp_Params });
  } else {
    // Thanh toán thất bại
    res.json({ code: '97', message: 'Invalid signature' });
  }
});

/* middlawares */
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
