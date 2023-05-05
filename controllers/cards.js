import Card from "../models/card.js";

export const getCards = (req, res) => {
  Card.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(500).send({ message: err.message }));
};

export const deleteCardId = (req, res) => {
  const { id } = req.params;

  Card.findByIdAndRemove(id).then((user) => {
    if (!user) {
      res.status(404).send({ message: "Карточка не найдена" });
      return;
    }

    res.status(201).send(user);
  });
};

export const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((item) => res.status(201).send(item))
    .catch((err) => res.status(500).send({ message: err.message }));
};

export const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((like) => res.status(200).send(like))
};

export const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((dislike) => res.status(200).send(dislike));
};
