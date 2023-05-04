import User from "../models/user.js";

export const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({ message: err.message }));
};

export const getUserId = (req, res) => {
  const { id } = req.params;

  User.findById(id).then((user) => {
    if (!user) {
      res.status(404).send({ message: "Пользователь не найден" });
      return;
    }

    res.send(user);
  });
};

export const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((item) => res.send(item))
    .catch((err) => res.status(500).send({ message: err.message }));
};
