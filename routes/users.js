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

const userRouter = express.Router();

userRouter.get('/', getUsers);
userRouter.get('/me', getUserMe);
userRouter.get('/:id', userIdJoi, getUserId);

userRouter.patch('/me', updateProfileJoi, updateProfile);
userRouter.patch('/me/avatar', updateAvatarJoi, updateAvatar);

export default userRouter;
