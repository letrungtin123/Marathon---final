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
import dateFormat from 'dateformat';
// import {querystring} from 'qs';
// import crypto from "crypto";
import sortObject from 'sortObject';

dotenv.config();

const app = express();

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

const helper = {
  VnpTmnCode: 'YOUR_TMN_CODE',
  VnpReturnURL: 'YOUR_RETURN_URL',
  VnpPayURL: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  VnpHashSecret: 'YOUR_HASH_SECRET',
};

const generateOrderID = () => `${Date.now()}`;

const getClientIP = (req) => {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
};

const hmacSHA512 = (key, data) => {
  return crypto.createHmac('sha512', key).update(data, 'utf-8').digest('hex');
};


app.post('/api/v1/create_payment_url', (req, res) => {
  const amount = req.body.amount || '0';
  const orderInfo = req.body.orderInfo || 'Thanh toán đơn hàng';

  const amountInt = parseInt(amount, 10);
  const date = new Date();
  date.setHours(date.getHours() + 7); // Chuyển sang GMT+7
  const createDate = dateFormat(date, 'yyyymmddHHMMss');
  const orderId = dateFormat(date, 'HHMMss');

  const params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: "78LQUS6C",
    vnp_Amount: 100000,
    vnp_CurrCode: 'VND',
    vnp_TxnRef: generateOrderID(),
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: 'other',
    vnp_Locale: 'vn',
    vnp_ReturnUrl: process.env.VNP_RETURN_URL,
    vnp_IpAddr: getClientIP(req),
    vnp_CreateDate: createDate,
  };

  const signData = createSignData(params);
  const signature = createSignature(signData);
  params['vnp_SecureHash'] = signature;

  const paymentURL = `${helper.VnpPayURL}?${querystring.stringify(params)}`;

  console.log(paymentURL);

  return res.json({ paymentURL });
});

const createSignData = (params) => {
  const keys = Object.keys(params).filter(
    (key) => key !== 'vnp_SecureHash' && key !== 'vnp_SecureHashType'
  );
  keys.sort();

  const signData = keys
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');

  return signData;
};

const createSignature = (data) => {
  return hmacSHA512(helper.VnpHashSecret, data).toLowerCase();
};

function sanitizeUrl(url) {
  // Sử dụng biểu thức chính quy để tìm và thay thế "[object Object]"
  return url.replace(/\[object Object\]/g, '&');
}

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
