import express from 'express';

import {
  getCards,
  createCard,
  deleteCardId,
  likeCard,
  dislikeCard,
} from '../controllers/cards.js';
import {
  createCardJoi,
  deleteCardJoi,
} from '../middlewares/celebrate.js';

const cardsRouter = express.Router();

cardsRouter.get('/cards', getCards);
cardsRouter.post('/cards', createCardJoi, createCard);
cardsRouter.delete('/cards/:cardId', deleteCardJoi, deleteCardId);

cardsRouter.put('/cards/:cardId/likes', likeCard);
cardsRouter.delete('/cards/:cardId/likes', dislikeCard);

export default cardsRouter;
