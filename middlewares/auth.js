/* eslint-disable func-names */
import jwt from 'jsonwebtoken';

import {
  UNAUTHORIZED,
} from '../utils/constant.js';

export default function (req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(UNAUTHORIZED).send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    return res.status(UNAUTHORIZED).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  return next();
}
