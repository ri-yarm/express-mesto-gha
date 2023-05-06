import mongoose from 'mongoose';
import validator from 'validator';

/** Схема пользователя. в массиве, второе значение для ответа пользователю */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Поле обязательна к заполнению'],
      minlength: [2, 'Минимальная длина поля - 2'],
      maxlength: [30, 'Максимальная длина поля - 2'],
    },
    about: {
      type: String,
      required: [true, 'Поле обязательна к заполнению'],
      minlength: [2, 'Минимальная длина поля - 2'],
      maxlength: [30, 'Максимальная длина поля - 2'],
    },
    avatar: {
      type: String,
      required: [true, 'Поле обязательна к заполнению'],
      validate: {
        validator: (v) => {
          validator.isURL(v);
        },
      },
    },
  },
  { versionKey: false },
);

export default mongoose.model('user', userSchema);
