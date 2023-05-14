import { celebrate, Joi } from 'celebrate';

// eslint-disable-next-line no-useless-escape
const linkRegex = /(https?:\/\/)(w{3}\.)?(\w+[-.~:\/?#[\]@!$&'()*+,;=]*#?){3,}/;

// users

export const signupJoi = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(1),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(linkRegex),
  }),
});

export const loginJoi = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(1),
  }),
});

export const updateProfileJoi = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

export const updateAvatarJoi = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(linkRegex),
  }),
});

export const userIdJoi = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
});

// cards

export const createCardJoi = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(linkRegex),
  }),
});

export const cardJoi = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
});
