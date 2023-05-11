import dotenv from 'dotenv';
import express from 'express';
/** импорт консоли для его корректной работы  */
import console from 'console';
import mongoose from 'mongoose';
/** Используем библиотеку express-rate-limit для защиты от DDoS атак */
import { rateLimit } from 'express-rate-limit';
/** Используем библиотеку helmet для защиты от кибератак */
import helmet from 'helmet';
// import config from './config.js';
import router from './routes/index.js';

dotenv.config();

const { PORT = 3000, MONGODB_URI = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

/** Конфигурация лимитера  */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50, // запросов с одного IP в течении поля "windowsMs"
  standardHeaders: true, // Возврщает заголовок с инофрмацией лимита
  legacyHeaders: false, // Отключает референсный заголовок ответа библиотеки
});

mongoose.connect(MONGODB_URI, {});

app.use(limiter);

app.use(helmet());

app.use(express.json());

app.use('/', router);

app.listen(PORT, () => {
  console.log(`Добро пожаловать в интернет, ты на порту ${PORT} `);
});
