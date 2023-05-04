import express from 'express';

import userRouter from './users.js';

const router = express.Router();

router.use(userRouter);

export default router;
