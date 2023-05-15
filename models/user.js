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
          return validator.isURL(v, {
            protocols: ['http', 'https'],
            require_protocol: true,
            require_valid_protocol: true,
          });
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
      select: false,
    },
  },
  {
    versionKey: false,
    statics: {
      /** Статический метод авторизации (банальный перебор по пользователям) */
      findUserByCredentials(email, password) {
        return this.findOne({ email })
          .select('+password')
          .then((user) => {
            if (!user) {
              return Promise.reject(
                new UnAuthorizedError('Неправильные почта или пароль'),
              );
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
      /** Статический метод обновления данных о профиле */
      changeUserProfile(id, data, res) {
        return this.findByIdAndUpdate(id, data, {
          new: true,
          runValidators: true,
        })
          .orFail()
          .then((user) => res.send(user));
      },
      /** Статический метод поиска пользователя
       * ! Внимание, используется для поиска пользователя как параметр,
       * ! и для обозначение себя как пользователя в запросе
       */
      getId(id, res) {
        return this.findById(id)
          .orFail()
          .then((user) => res.send(user));
      },
    },
  },
);

export default mongoose.model('user', userSchema);
