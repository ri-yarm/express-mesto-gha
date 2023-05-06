import express from 'express';
/** импорт консоли для его корректной работы  */
import console from 'console';
import mongoose from 'mongoose';
/** Используем библиотеку express-rate-limit для защиты от DDoS атак */
import { rateLimit } from 'express-rate-limit';
/** Используем библиотеку helmet для защиты от кибератак */
import helmet from 'helmet';
import config from './config.js';
import router from './routes/index.js';

const { port } = config;

const app = express();

/** Конфигурация лимитера  */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50, // запросов с одного IP в течении поля "windowsMs"
  standardHeaders: true, // Возврщает заголовок с инофрмацией лимита
  legacyHeaders: false, // Отключает референсный заголовок ответа библиотеки
});

mongoose.connect('mongodb://localhost:27017/mestodb', {});

app.use(limiter);

app.use(helmet());

/** Хардкод пользователя */
app.use((req, res, next) => {
  req.user = {
    _id: '645543dc1b2c4016665d85b7',
  };

  next();
});

app.use(express.json());

app.use('/', router);

app.listen(port, () => {
  console.log(`Добро пожаловать в интернет, ты на порту ${port} `);
});
