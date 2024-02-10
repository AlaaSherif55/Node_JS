const fs = require('fs');

const getAllTodosRe = (path) => JSON.parse(fs.readFileSync(`${path}`, 'utf-8'));
const writeIntoTodosFile = (todos) => fs.writeFileSync('todos.json', JSON.stringify(todos, null, 2));

module.exports = {
  getAllTodosRe,
  writeIntoTodosFile,
};
