/* eslint-disable func-names */
import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import UnAuthorizedError from '../utils/instanceOfErrors/unAuthorizedError.js';

/** Схема пользователя. в массиве, второе значение для ответа пользователю */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, 'Минимальная длина поля - 2'],
      maxlength: [30, 'Максимальная длина поля - 2'],
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: [2, 'Минимальная длина поля - 2'],
      maxlength: [30, 'Максимальная длина поля - 2'],
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      validate: {
        // здесь валидация проходит через библиотеку validate, по паттерну проверка идёт при входе
        validator(v) {
          return validator.isURL(v, { protocols: ['http', 'https'], require_protocol: true, require_valid_protocol: true });
        },
        message: 'Некорректный URL аватара',
      },
      default:
        'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    email: {
      type: String,
      required: [true, 'Поле обязательно к заполнению'],
      validate: {
        validator(v) {
          return validator.isEmail(v);
        },
        message: 'Некорректный Email',
      },
      unique: [true, 'Такой емейл уже зарегистрирован'],
    },
    password: {
      type: String,
      required: [true, 'Поле обязательно к заполнению'],
      // minlength: [6, 'Минимальная длина пароля - 6'],
      /* Прикольно, если стоит поле select, то валидировать его  по длине нельзя */
      select: false,
    },
  },
  {
    versionKey: false,
    statics: {
      findUserByCredentials(email, password) {
        return this.findOne({ email })
          .select('+password')
          .then((user) => {
            if (!user) {
              return Promise.reject(new UnAuthorizedError('Неправильные почта или пароль'));
            }

            return bcrypt.compare(password, user.password).then((matched) => {
              if (!matched) {
                return Promise.reject(
                  new UnAuthorizedError('Неправильные почта или пароль'),
                );
              }

              return user;
            });
          });
      },
    },
  },
);

export default mongoose.model('user', userSchema);
