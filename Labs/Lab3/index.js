const express = require('express');
const router = require('./routes/todos');

const app = express();
const PORT = 3000;
const hostname = '127.0.0.1';
app.use(express.json());

app.use('/todos', router);
app.use(express.static('public'));
app.set('view engine', 'pug');

app.listen(PORT, () => {
  console.log(`Server is running at http://${hostname}:${PORT}/`);
});
