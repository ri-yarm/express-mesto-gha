import User from '../models/user.js';

const users = {
  myNane: 'Rinat',
};

export const getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send({ message: err.message }));
};

export const getUserId = (req, res) => {
  const { id } = req.params;

  const user = users.find((item) => item._id === id);

  if (!user) {
    return res.status(404).send({ message: 'Пользователь не найден' });
  }

  res.send(user);
};

export const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((item) => res.send(item))
    .catch((err) => res.status(500).send({ message: err.message }));
};
