/* eslint-disable no-useless-escape */
import { celebrate, Joi } from "celebrate";

const linkRegex = /(https?:\/\/)(w{3}\.)?(\w+[-.~:\/?#[\]@!$&'()*+,;=]*#?){3,}/;

// users

export const signupJoi = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(3).max(30),
    password: Joi.string().required().min(6),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(linkRegex),
  }),
});

export const loginJoi = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(3).max(30),
    password: Joi.string().required().min(6),
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

export const getUserdIdJoi = celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum(),
  }),
});

// cards

export const createCardJoi = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(linkRegex),
  }),
});

export const deleteCardJoi = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum(),
  }),
});
