import express from 'express';
import mongoose from 'mongoose';
import router from './routes/index.js';

const { PORT = 3000, BASE_PATH } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use('users', router);

app.listen(PORT, () => {
  console.log(PORT, BASE_PATH);
});
