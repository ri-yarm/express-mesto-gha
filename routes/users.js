import express from 'express';

import { getUsers, getUserId, createUser } from '../controllers/users.js';

const userRouter = express.Router();

userRouter.get('/users', getUsers);
userRouter.get('/user/:id', getUserId);
userRouter.post('/users', createUser);

export default userRouter;
