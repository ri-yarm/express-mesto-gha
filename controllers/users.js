import console from 'console';


import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import {
  DEFAULT_ERROR,
  CREATE_SUCCESS_STATUS,
  DEFAULT_SUCCESS_STATUS,
  INCORRECT_DATA_ERROR,
  NOT_FOUND_ERROR,
  DEFAULT_ERROR_MESSAGE,
  UNAUTHORIZED,
} from '../utils/constant.js';

const SALT = 10;

export const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(DEFAULT_SUCCESS_STATUS).send(users))
    .catch(() => {
      res.status(DEFAULT_ERROR).send({ message: DEFAULT_ERROR_MESSAGE });
    });
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
      return res.status(DEFAULT_ERROR).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

export const getUserMe = (req, res) => {
  const { _id } = req.user;

  User.findById(_id)
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
          .send({ message: 'Не валидные данные для поиска fgdssdfds' });
      }
      return res.status(DEFAULT_ERROR).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

export const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, SALT).then((hash) => {
    User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
      .then((user) => res.status(CREATE_SUCCESS_STATUS).send({
        email: user.email,
        _id: user._id
      }))
      .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
          return res.status(INCORRECT_DATA_ERROR).send({
            message: err.message,
          });
        }
        return res
          .status(DEFAULT_ERROR)
          .send({ message: DEFAULT_ERROR_MESSAGE });
      });
  });
};

export const updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
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

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.status(DEFAULT_SUCCESS_STATUS).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Пользователь с указанным _id не найден.' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(INCORRECT_DATA_ERROR).send({
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

export const login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user.id }, 'secret-key', {
        expiresIn: '7d',
      });

      res.status(DEFAULT_SUCCESS_STATUS).send(token);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Пользователь с указанным email не найден.' });
      }
      return res.status(UNAUTHORIZED).send({ message: err.message });
    });
};
