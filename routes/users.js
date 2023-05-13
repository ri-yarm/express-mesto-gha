import express from 'express';

import {
  getUsers,
  getUserId,
  updateProfile,
  updateAvatar,
  getUserMe,
} from '../controllers/users.js';
import {
  userIdJoi,
  updateAvatarJoi,
  updateProfileJoi,
} from '../middlewares/celebrate.js';
// import user from '../models/user.js';

const userRouter = express.Router();

userRouter.get('/users', getUsers);
userRouter.get('/users/me', getUserMe);
userRouter.get('/users/:id', userIdJoi, getUserId);

userRouter.patch('/users/me', updateProfileJoi, updateProfile);
userRouter.patch('/users/me/avatar', updateAvatarJoi, updateAvatar);

export default userRouter;
