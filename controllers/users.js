import mongoose from 'mongoose';
import User from '../models/user.js';
import {
  DEFAULT_ERROR,
  CREATE_SUCCESS_STATUS,
  DEFAULT_SUCCESS_STATUS,
  INCORRECT_DATA_ERROR,
  NOT_FOUND_ERROR,
  DEFAULT_ERROR_MESSAGE,
} from '../utils/constant.js';

export const getUsers = (req, res) => {
  User.find({})
    .orFail()
    .then((users) => res.status(DEFAULT_SUCCESS_STATUS).send(users))
    .catch(() => res.status(DEFAULT_ERROR).send({ message: DEFAULT_ERROR_MESSAGE }));
};

export const getUserId = (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .orFail()
    .then((user) => res.status(DEFAULT_SUCCESS_STATUS).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res
          .status(INCORRECT_DATA_ERROR)
          .send({ message: 'Не валидные данные для поиска' });
      }
      return res
        .status(DEFAULT_ERROR)
        .send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

export const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(CREATE_SUCCESS_STATUS).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(INCORRECT_DATA_ERROR).send({
          message: 'Не введены данные для регистрации пользователя',
        });
      }
      return res.status(DEFAULT_ERROR).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

export const updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.status(DEFAULT_SUCCESS_STATUS).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Пользователь с указанным _id не найден.' });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(INCORRECT_DATA_ERROR).send({
          message: 'Не введены данные для обновления информации о пользователе',
        });
      }
      return res.status(DEFAULT_ERROR).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

export const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.status(DEFAULT_SUCCESS_STATUS).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Пользователь с указанным _id не найден.' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res
          .status(INCORRECT_DATA_ERROR)
          .send({
            message: 'Переданы некорректные данные при обновлении аватара.',
          });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(INCORRECT_DATA_ERROR).send({
          message: 'Не введены данные для обновления аватара пользователя',
        });
      }
      return res.status(DEFAULT_ERROR).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};
