import console from 'console';

import mongoose from 'mongoose';
import Card from '../models/card.js';
import {
  DEFAULT_ERROR,
  CREATE_SUCCESS_STATUS,
  DEFAULT_SUCCESS_STATUS,
  INCORRECT_DATA_ERROR,
  NOT_FOUND_ERROR,
  DEFAULT_ERROR_MESSAGE,
} from '../utils/constant.js';

export const getCards = (req, res) => {
  Card.find({})
    .then((card) => res.status(DEFAULT_SUCCESS_STATUS).send(card))
    .catch(() =>
      res.status(DEFAULT_ERROR).send({ message: DEFAULT_ERROR_MESSAGE }),
    );
};

export const deleteCardId = (req, res) => {
  const { id } = req.params;

  Card.findById(id)
    .orFail()
    .then((card) => {
      if (toString(card.owner) !== req.user._id) {
        console.log('Кого ты собираешься наебать чучело');
        return Promise.reject(new Error('Удалять можно только свои карточки.'));
      }
      return card;
    })
    .then((card) => {
      Card.deleteOne(card);
    })
    .then((card) => res.status(DEFAULT_SUCCESS_STATUS).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Карточка с указанным _id не найдена.' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res
          .status(INCORRECT_DATA_ERROR)
          .send({ message: 'Не валидные данные для поиска' });
      }
      return res.status(DEFAULT_ERROR).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

export const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((item) => res.status(CREATE_SUCCESS_STATUS).send(item))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(INCORRECT_DATA_ERROR).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
      }
      return res.status(DEFAULT_ERROR).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

export const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail()
    .then((like) => res.status(DEFAULT_SUCCESS_STATUS).send(like))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Передан несуществующий _id карточки.' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(INCORRECT_DATA_ERROR).send({
          message: 'Переданы некорректные данные для постановки лайка.',
        });
      }
      return res.status(DEFAULT_ERROR).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

export const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail()
    .then((dislike) => res.status(DEFAULT_SUCCESS_STATUS).send(dislike))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Передан несуществующий _id карточки.' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res
          .status(INCORRECT_DATA_ERROR)
          .send({ message: 'Переданы некорректные данные для снятии лайка.' });
      }
      return res.status(DEFAULT_ERROR).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};
