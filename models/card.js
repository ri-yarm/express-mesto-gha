import mongoose from 'mongoose';
import validator from 'validator';

/** Схема карточек. в массиве, второе значение для ответа пользователю */
const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Поле обязательна к заполнению'],
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 2'],
    },
    link: {
      type: String,
      required: [true, 'Поле обязательна к заполнению'],
      validate: {
        validator: (v) => {
          validator.isURL(v);
        },
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'user',
      default: [],
    },
    createdAT: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

export default mongoose.model('card', cardSchema);
