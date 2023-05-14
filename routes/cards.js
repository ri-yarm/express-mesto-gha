import express from 'express';

import {
  getCards,
  createCard,
  deleteCardId,
  likeCard,
  dislikeCard,
} from '../controllers/cards.js';
import {
  cardJoi,
  createCardJoi,
} from '../middlewares/celebrate.js';

const cardsRouter = express.Router();

cardsRouter.get('/', getCards);
cardsRouter.post('/', createCardJoi, createCard);
cardsRouter.delete('/:cardId', cardJoi, deleteCardId);

cardsRouter.put('/:cardId/likes', cardJoi, likeCard);
cardsRouter.delete('/:cardId/likes', cardJoi, dislikeCard);

export default cardsRouter;
