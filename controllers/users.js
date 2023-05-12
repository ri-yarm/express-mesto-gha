import console from 'console'

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import {
  /*   CREATE_SUCCESS_STATUS,
  DEFAULT_SUCCESS_STATUS, */
  SECRET_KEY,
  SALT,
} from '../utils/constant.js';
import BadReqestError from '../utils/instanceOfErrors/badRequestError.js';
import NotFoundError from '../utils/instanceOfErrors/notFoundError.js';
import DuplicateError from '../utils/instanceOfErrors/duplicateError.js';

export const getUsers = (req, res, next) => {
  User.find({})
    .then((users) =>
      res /* .status(DEFAULT_SUCCESS_STATUS) */
        .send(users),
    )
    .catch(next);
};

export const getUserId = (req, res, next) => {
  const { id } = req.params;

  User.findById(id)
    .orFail()
    .then((user) =>
      res /* .status(DEFAULT_SUCCESS_STATUS) */
        .send(user),
    )
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Пользователь с указанным id не найден.'));
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadReqestError('Не валидные данные для поиска.'));
      }
      return next(err);
    });
};

export const getUserMe = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .orFail()
    .then((user) =>
      res /* .status(DEFAULT_SUCCESS_STATUS) */
        .send(user),
    )
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Пользователь с указанным id не найден.'));
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadReqestError('Не валидные данные для поиска.'));
      }
      return next(err);
    });
};

export const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  if (!password) {
    return next(new BadReqestError('Необходимо указать пароль'));
  }


  bcrypt.hash(password, SALT).then((hash) => {
    User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
      .then((user) =>
        res /* .status(CREATE_SUCCESS_STATUS) */
          .send({
            email: user.email,
            _id: user._id,
          }),
      )
      .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
          return next(
            new BadReqestError(
              'Переданы некорректные данные при создании карточки.',
            ),
          );
        }
        if (err instanceof mongoose.Error.CastError) {
          return next(new BadReqestError('Не валидные данные.'));
        }
        // Вот этот хардкод ошибки 11000 меня злит, не нашёл инстанс ошибки
        if (err.code === 11000) {
          return next(
            new DuplicateError(
              'Пользователь с таким email уже был зарегистрирован.',
            ),
          );
        }
        return next(err);
      });
  });
};

export const updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) =>
      res /* .status(DEFAULT_SUCCESS_STATUS) */
        .send(user),
    )
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Пользователь с указанным id не найден.'));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return next(
          new BadReqestError(
            'Переданы некорректные данные при обновлении профиля пользователя.',
          ),
        );
      }
      return next(err);
    });
};

export const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) =>
      res /* .status(DEFAULT_SUCCESS_STATUS) */
        .send(user),
    )
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Пользователь с указанным id не найден.'));
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadReqestError('Не валидные данные для поиска.'));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return next(
          new BadReqestError(
            'Переданы некорректные данные при обновлении аватара пользователя.',
          ),
        );
      }
      return next(err);
    });
};

export const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user.id }, SECRET_KEY, {
        expiresIn: '7d',
      });

      res /* .status(DEFAULT_SUCCESS_STATUS) */
        .send(token);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(
          new BadReqestError(
            'Переданы некорректные данные при обновлении аватара пользователя.',
          ),
        );
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadReqestError('Не валидные данные.'));
      }
      return next(err);
    });
};
