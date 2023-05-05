import User from "../models/user.js";

export const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(500).send({ message: err.message }));
};

export const getUserId = (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'DocumenNotFoundError') {
        res.status(404).send({ message: "Пользователь не найден" });
        return;
      }

    })
};

export const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  console.log(req.body);

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => res.status(500).send({ message: err.message }));
};

export const updateProfile = (req, res) => {
  const { name, about} = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => res.status(201).send(user));
};

export const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => res.status(201).send(user));
};
