import express from 'express';

import userRouter from './users.js';

import cardsRouter from './cards.js';

const router = express.Router();

router.use(userRouter);
router.use(cardsRouter);

export default router;
