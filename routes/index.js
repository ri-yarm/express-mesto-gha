import express from 'express';
import { errors } from 'celebrate';
import auth from '../middlewares/auth.js';
import userRouter from './users.js';
import cardsRouter from './cards.js';
import NotFoundError from '../utils/instanceOfErrors/notFoundError.js';
import { createUser, login } from '../controllers/users.js';
import { signupJoi, loginJoi } from '../middlewares/celebrate.js';

const router = express.Router();

router.post('/signup', signupJoi, createUser);
router.post('/signin', loginJoi, login);

router.use(auth);

router.use(userRouter);
router.use(cardsRouter);

/** Все эндпоинты которые не были обработны будут приходить сюда */
router.use('/*', (req, res, next) => {
  next(new NotFoundError('Непредвиденная ошибка сервера!'));
});

// ошибки от celebrate передаст ошибку в центральный обработчик ошибок
router.use(errors({ message: 'Ошибка валидации данных!' }));

export default router;
