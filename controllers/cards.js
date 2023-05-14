import mongoose from 'mongoose';
import Card from '../models/card.js';
import BadReqestError from '../utils/instanceOfErrors/badRequestError.js';
import NotFoundError from '../utils/instanceOfErrors/notFoundError.js';
import ForbiddenError from '../utils/instanceOfErrors/forbiddenError.js';

/** Получение всех карточек */
export const getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send(card))
    .catch(next);
};

/** Удаление конкретной карточки */
export const deleteCardId = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Удалять можно только свои карточки.');
      }
      return card;
    })
    .then((card) => Card.deleteOne(card))
    .then((card) => res.send(card))
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

/** Создание карточки */
export const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((item) => res.send(item))
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

/** Лайк конкретной карточки */
export const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail()
    .then((like) => res.send(like))
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

/** Удаление лайка конкретной карточки */
export const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail()
    .then((dislike) => res.send(dislike))
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
