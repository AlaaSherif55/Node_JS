const router = require('express').Router();
const todoController = require('../Controller/todos');

// get All todos
router.get('/', todoController.showAllTodos);

router.get('/html', (req, res) => {
  res.render('todos', { todos: todoController.getAllTodos() });
});
// get specific todo
router.get('/:id', todoController.validateID, todoController.validateExistTodo, todoController.getSpecificTodo);

// post todo
router.post('/', todoController.validatePost, todoController.createTodo);

// delete todo
router.delete('/:id', todoController.validateID, todoController.validateExistTodo, todoController.deleteTodo);

// patch todo
router.patch('/:id', todoController.validateID, todoController.validatePatch, todoController.validateExistTodo, todoController.updateTodo);

module.exports = router;
