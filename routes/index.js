import express from 'express';
import userRouter from './users.js';
import cardsRouter from './cards.js';
import { NOT_FOUND_ERROR } from '../utils/constant.js';

const router = express.Router();

router.use(userRouter);
router.use(cardsRouter);

/** Все эндпоинты которые не были обработны будут приходить сюда */
router.use('/*', (req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: 'Непредвиденная ошибка сервера!' });
});

export default router;
