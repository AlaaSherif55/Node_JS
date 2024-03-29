const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const Users = require('../models/users');
const Todos = require('../models/todos');
const CustomError = require('../lib/customError');

dotenv.config();
const secretKey = process.env.key || 'sdsdsdsdsds';
const create = async (input) => {
  const user = await Users.create(input)
    .catch((err) => {
      throw new CustomError(err.message, 422);
    });
  return user;
};

const login = async (username, password) => {
  const user = await Users.findOne({ userName: username }).exec();
  if (!user) {
    return new CustomError('UN_AUTH', 401);
  }
  const valid = await user.verifyPassword(password);
  if (!valid) {
    return new CustomError('UN_AUTH', 401);
  }
  user.token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1d' });
  return user;
};

const getUser = async (query) => {
  const user = await Users.findOne({ _id: query })
    .catch((err) => {
      throw new CustomError(err.message, 422);
    });
  return user;
};

const getAllUsers = async (id, isAdmin) => {
  let users;
  if (isAdmin) {
    users = await Users.find().select({ _id: 0, firstName: 1 })
      .catch((err) => {
        throw new CustomError(err.message, 422);
      });
  } else {
    users = await Users.find({ _id: id }).select({ _id: 0, firstName: 1 });
  }

  return users;
};

const deleteUser = async (id, isAdmin) => {
  let acknowledge;
  if (isAdmin) {
    acknowledge = await Users.deleteOne({ _id: id })
      .catch((err) => {
        throw new CustomError(err.message, 422);
      });
    return acknowledge;
  }
  return new CustomError('unauthorized', 422);
};

const updateUser = async (id, body, isAdmin) => {
  let user;
  if (isAdmin) {
    user = await Users.findOneAndUpdate({ _id: id }, body, { new: true })
      .catch((err) => {
        throw new CustomError(err.message, 422);
      });
    return user;
  }
  return new CustomError('unauthorized', 422);
};

const getTodosForUser = async (query) => {
  const todos = await Todos.find({ userId: query })
    .catch((err) => {
      throw new CustomError(err.message, 422);
    });
  return todos;
};

module.exports = {
  create,
  getAllUsers,
  getTodosForUser,
  deleteUser,
  updateUser,
  getUser,
  login,
};
