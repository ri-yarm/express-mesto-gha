import express from 'express';
import auth from '../middlewares/auth.js';

import {
  getCards,
  createCard,
  deleteCardId,
  likeCard,
  dislikeCard,
} from '../controllers/cards.js';

const cardsRouter = express.Router();

cardsRouter.use(auth);

cardsRouter.get('/cards', getCards);
cardsRouter.post('/cards', createCard);
cardsRouter.delete('/cards/:cardId', deleteCardId);

cardsRouter.put('/cards/:cardId/likes', likeCard);
cardsRouter.delete('/cards/:cardId/likes', dislikeCard);

export default cardsRouter;
