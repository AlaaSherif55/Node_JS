const fs = require("fs");
const path = require("path");
const [, , command, ...data] = process.argv;
const toDoFilePath = path.join(__dirname, "todos.json");
let todos;

try {
  fs.accessSync(toDoFilePath);
} catch (error) {
  // File doesn't exist, create it
  fs.writeFileSync(toDoFilePath, "[]");
}
const content = fs.readFileSync(toDoFilePath, "utf-8");
if (content !== "") {
  todos = JSON.parse(content);
} else {
  todos = [];
}
function getNextID(todos) {
  if (todos.length !== 0) {
    return todos[todos.length - 1].id+1;
  } else {
    return 1;
  }
}

function list(todos, data) {
  const [option,status] = data;
  let filteredTodos = todos;
  if(option!="-s"){
    let todoList = todos.map(todo => `ID:${todo.id} Title:${todo.title} Status:${todo.status}`).join('\n');
    console.log(todoList);
    return;
  }
  if (status) {
    filteredTodos = todos.filter(todo => todo.status === status);
  }
  let todoList = filteredTodos.map(todo => `ID:${todo.id} Title:${todo.title} Status:${todo.status}`).join('\n');
  console.log(todoList);
}

function add(todos, data) {
  // Increment the last assigned ID for the new todo
  //const newTodo = { id: getNextID(todos), title: data.join(" ") };
  const newTodo = { id: getNextID(todos), title: data.join(" "), status: "to-do" };
  todos.push(newTodo);
  // Convert object to JSON string
  fs.writeFileSync(toDoFilePath, JSON.stringify(todos, null, 2));
}

function getOption(option) {
  let operation = {
    'add': add,
    'delete': del,
    'edit': edit,
    'list': list
  }[option];

  return operation || "NOT A CRUD OPERATION";
}

function edit(todos, data) {
  const [editID, editStatus, editTitle] = data;
  const intEditId = parseInt(editID);

  if (isNaN(intEditId)) {
    console.log("The ID IS NOT A NUMBER");
    return;
  }

  const todoToEdit = todos.find(todo => todo.id === intEditId);

  if (!todoToEdit) {
    console.log("NOT FOUND");
    return;
  }

  if (editStatus) {
    todoToEdit.status = editStatus;
  }

  if (editTitle) {
    todoToEdit.title = editTitle;
  }

  fs.writeFileSync(toDoFilePath, JSON.stringify(todos, null, 2));
}

function del(todos, data) {
  const [deleteID] = data;
  const intDeleteId = parseInt(deleteID);
  if(isNaN(intDeleteId)){
    console.log("The ID IS NOT A NUMBER");
    return;
  }
  const todoToDeleteIndex = todos.findIndex(todo => todo.id === intDeleteId);
  if(todoToDeleteIndex == -1){
    console.log("NOT FOUND");
    return;
  }
  todos.splice(todoToDeleteIndex, 1);
  fs.writeFileSync(toDoFilePath, JSON.stringify(todos, null, 2));
}

const operation = getOption(command);
if (operation) {
  operation(todos, data);
} else {
  console.log("NOT A CRUD OPERATION");
}
