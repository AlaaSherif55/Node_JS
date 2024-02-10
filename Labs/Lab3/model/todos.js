const fs = require('fs');

const getAllTodosRe = () => JSON.parse(fs.readFileSync('todos.json', 'utf-8'));
const writeIntoTodosFile = (todos) => fs.writeFileSync('todos.json', JSON.stringify(todos, null, 2));
const getFiliterdTodosFile = (status) => {
  const todos = JSON.parse(fs.readFileSync('todos.json', 'utf-8'));
  const filteredTodos = todos.filter((todo) => todo.status === status);
  return filteredTodos;
};
module.exports = {
  getAllTodosRe,
  writeIntoTodosFile,
  getFiliterdTodosFile,
};
