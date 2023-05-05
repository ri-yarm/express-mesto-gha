import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import router from './routes/index.js';

const { PORT = 3000, BASE_PATH } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {});

app.use((req, res, next) => {
  req.user = {
    _id: '645543dc1b2c4016665d85b7',
  }

  next()
})

app.use(bodyParser.json()); // для собирания JSON-формата

app.use('/', router);

app.listen(PORT, () => {
  console.log(PORT, BASE_PATH);
});
