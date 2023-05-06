import express from 'express';

import {
  getUsers,
  getUserId,
  createUser,
  updateProfile,
  updateAvatar,
} from '../controllers/users.js';

const userRouter = express.Router();

userRouter.get('/users', getUsers);
userRouter.get('/user/:id', getUserId);
userRouter.post('/users', createUser);

userRouter.patch('/users/me', updateProfile);
userRouter.patch('/users/me/avatar', updateAvatar);

export default userRouter;
