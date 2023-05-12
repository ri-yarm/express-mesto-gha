import mongoose from 'mongoose';
import Card from '../models/card.js';
/* import {
  DEFAULT_ERROR,
  CREATE_SUCCESS_STATUS,
  DEFAULT_SUCCESS_STATUS,
} from '../utils/constant.js'; */
import BadReqestError from '../utils/instanceOfErrors/badRequestError.js';
import NotFoundError from '../utils/instanceOfErrors/notFoundError.js';

export const getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res/* .status(DEFAULT_SUCCESS_STATUS) */.send(card))
    .catch(next);
};

export const deleteCardId = (req, res, next) => {
  const { id } = req.params;

  Card.findById(id)
    .orFail()
    .then((card) => {
      if (toString(card.owner) !== req.user._id) {
        return Promise.reject(new Error('Удалять можно только свои карточки.'));
      }
      return card;
    })
    .then((card) => {
      Card.deleteOne(card);
    })
    .then((card) => res/* .status(DEFAULT_SUCCESS_STATUS) */.send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Карточка с указанным id не найдена.'));
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadReqestError('Не валидные данные для поиска.'));
      }
      /* if (
        err instanceof Error &&
        err.message === 'Удалять можно только свои карточки.'
      ) {
        res.status(UNAUTHORIZED).send({ message: err.message });
      } */
      return next(err);
    });
};

export const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((item) => res/* .status(CREATE_SUCCESS_STATUS) */.send(item))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(
          new BadReqestError(
            'Переданы некорректные данные при создании карточки.',
          ),
        );
      }
      return next(err);
    });
};

export const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail()
    .then((like) => res/* .status(DEFAULT_SUCCESS_STATUS) */.send(like))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Карточка с указанным id не найдена.'));
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadReqestError('Не валидные данные для поиска.'));
      }
      return next(err);
    });
};

export const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail()
    .then((dislike) => res/* .status(DEFAULT_SUCCESS_STATUS) */.send(dislike))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Карточка с указанным id не найдена.'));
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadReqestError('Не валидные данные для поиска.'));
      }
      return next(err);
    });
};
