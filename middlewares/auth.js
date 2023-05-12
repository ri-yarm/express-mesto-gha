/* eslint-disable func-names */
import jwt from 'jsonwebtoken';
import UnAuthorizedError from '../utils/instanceOfErrors/unAuthorizedError.js';
import { SECRET_KEY } from '../utils/constant.js';

export default function (req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnAuthorizedError('Необходима авторизация.'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return next(new UnAuthorizedError('Необходима авторизация.'));
  }

  req.user = payload;

  return next();
}
