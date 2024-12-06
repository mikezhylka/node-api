import express from 'express';
import mongoose from 'mongoose';

import { logger } from './middleware/logger.js';
import UsersRouter from './routes/users.js';

import OrdersRouter from './routes/orders.js';

const PORT = 3000;
const DATABASE_URL = 'mongodb://localhost:27017/node-api';

const server = express();

server.use(logger);
server.use('/users/singleEndpointMiddleware', (req, res, next) => {
  console.log('single endpoint');
  next();
});

server.get('/', (req, res) => {
  res.send('Hello world!');
});

server.use(express.json());
server.use('/users', UsersRouter);

server.listen(PORT, async () => {
  console.log(`Server listens on port ${PORT}`);
  try {
    await mongoose.connect(DATABASE_URL);
    console.log(`Database connected at URL ${DATABASE_URL}`);
  } catch (error) {
    console.log(error);
  }
})

server.use('/orders', OrdersRouter);
