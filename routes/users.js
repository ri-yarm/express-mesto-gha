import express from 'express';
import auth from '../middlewares/auth.js';

import {
  getUsers,
  getUserId,
  createUser,
  updateProfile,
  updateAvatar,
  login,
  getUserMe,
} from '../controllers/users.js';
// import user from '../models/user.js';

const userRouter = express.Router();

userRouter.post('/signup', createUser);
userRouter.post('/signin', login);

userRouter.use(auth);

userRouter.get('/users', getUsers);
userRouter.get('/users/me', getUserMe);
userRouter.get('/users/:id', getUserId);

userRouter.patch('/users/me', updateProfile);
userRouter.patch('/users/me/avatar', updateAvatar);

export default userRouter;
