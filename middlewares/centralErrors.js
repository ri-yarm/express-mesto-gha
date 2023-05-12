/* eslint-disable func-names */
import { DEFAULT_ERROR, DEFAULT_ERROR_MESSAGE } from '../utils/constant.js';
/** Централизованная обработка ошибок */
export default function (err, req, res, next) {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === DEFAULT_ERROR ? DEFAULT_ERROR_MESSAGE : message,
    });

  next();
}
