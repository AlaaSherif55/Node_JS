const todoModel = require('../model/todos');

function getNextID(todos) {
  if (todos.length !== 0) {
    return todos[todos.length - 1].id + 1;
  }
  return 1;
}

const validateID = (req, res, next) => {
  if (Number.isNaN(parseInt(req.params.id, 10))) {
    res.status(400).send('NOT A Valid ID');
  }
  next();
};

const validateExistTodo = (req, res, next) => {
  const path = 'todos.json';
  const todos = todoModel.getAllTodosRe(path);
  const inputID = parseInt(req.params.id, 10);
  const filteredTodo = todos.find((todo) => todo.id === inputID);
  if (!filteredTodo) {
    res.status(404).send('NOT FOUND');
  }
  req.todo = filteredTodo;
  req.todos = todos;
  next();
};

const validatePost = (req, res, next) => {
  if (!req.body.id && req.body.title && !req.body.status) {
    next();
  }
  res.status(400).send('Incorrect input');
};

const validatePatch = (req, res, next) => {
  if (!req.body.id) {
    if (req.body.title || req.body.status) {
      next();
    }
  } else {
    res.status(400).send('Incorrect input');
  }
};

const getSpecificTodo = (req, res) => {
  res.json(req.todo);
};

const showAllTodos = (req, res) => {
  if (!req.query) {
    const todos = todoModel.getAllTodosRe();
    res.json(todos);
  }

  if (!req.query.status) {
    res.status(400).send('incorrect condition');
  }

  const filterTodos = todoModel.getFiliterdTodosFile(req.query.status);
  res.json(filterTodos);
};
const getAllTodos = () => todoModel.getAllTodosRe();

const getFiliterdTodos = (status) => {
  if (!status) {
    return todoModel.getAllTodosRe();
  }
  return todoModel.getFiliterdTodosFile(status);
};

const createTodo = (req, res) => {
  const todos = todoModel.getAllTodosRe();
  const newTodo = { id: getNextID(todos), title: req.body.title, status: 'to-do' };
  todos.push(newTodo);
  todoModel.writeIntoTodosFile(todos);
  res.end();
};

const deleteTodo = (req, res) => {
  const todosAfterDel = req.todos.filter((todo) => todo.id !== parseInt(req.params.id, 10));
  todoModel.writeIntoTodosFile(todosAfterDel);
  res.send('deleted successfully!');
};

const updateTodo = (req, res) => {
  const todoToEdit = req.todos.find((todo) => todo.id === parseInt(req.params.id, 10));
  if (req.body.title) {
    todoToEdit.title = req.body.title;
  }
  if (req.body.status) {
    if ((req.body.status === 'to-do') || (req.body.status === 'in-progress') || (req.body.status === 'complete')) {
      todoToEdit.status = req.body.status;
    } else {
      res.status(400).send('Can not update status to this value');
    }
  }
  todoModel.writeIntoTodosFile(req.todos);
  res.send('Updated successfully!');
};

module.exports = {
  validateID,
  validateExistTodo,
  validatePost,
  validatePatch,
  getSpecificTodo,
  showAllTodos,
  getAllTodos,
  createTodo,
  deleteTodo,
  updateTodo,
  getFiliterdTodos,
};
