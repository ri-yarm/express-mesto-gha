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

cardsRouter.get('/cards', getCards);
cardsRouter.post('/cards', createCardJoi, createCard);
cardsRouter.delete('/cards/:cardId', cardJoi, deleteCardId);

cardsRouter.put('/cards/:cardId/likes', cardJoi, likeCard);
cardsRouter.delete('/cards/:cardId/likes', cardJoi, dislikeCard);

export default cardsRouter;
