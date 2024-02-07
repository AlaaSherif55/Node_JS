const fs = require('fs');
const path = require('path');

const todosFilePath = path.join(__dirname, 'todos.json');

function handleHomePage(req, res) {
  const todosReadStream = fs.createReadStream(todosFilePath, 'utf-8');
  let todosData = '';

  todosReadStream.on('data', (chunk) => {
    todosData += chunk;
  });

  todosReadStream.on('end', () => {
    const todos = JSON.parse(todosData);
    const todosHtmlFilePath = 'todos.html';
    const todosHtmlReadStream = fs.createReadStream(todosHtmlFilePath, 'utf-8');
    let htmlContent = '';

    todosHtmlReadStream.on('data', (htmlChunk) => {
      htmlContent += htmlChunk;
    });

    todosHtmlReadStream.on('end', () => {
      let dynamicContent = '';
      todos.forEach((todo) => {
        dynamicContent += `
          <div class="card">
            <div class="card-title">${todo.title}</div>
            <div class="card-status">${todo.status}</div>
          </div>`;
      });

      htmlContent = htmlContent.replace('<!-- Todos will be dynamically inserted here -->', dynamicContent);
      res.setHeader('Content-Type', 'text/html');
      res.end(htmlContent);
    });
  });
}

function handleAstronomyPage(req, res) {
  res.setHeader('Content-Type', 'text/html');
  const astronomyHtmlPath = path.join(__dirname, 'astronomy.html');
  const astronomyReadStream = fs.createReadStream(astronomyHtmlPath, 'utf-8');
  astronomyReadStream.pipe(res);
}

function handleCSS(req, res) {
  res.setHeader('Content-Type', 'text/css');
  const cssFileName = req.url === '/todos.css' ? 'todos.css' : 'style.css';
  const cssFilePath = path.join(__dirname, cssFileName);
  const cssReadStream = fs.createReadStream(cssFilePath, 'utf-8');
  cssReadStream.pipe(res);
}
function handleImage(req, res) {
  res.setHeader('Content-Type', 'image/jpg');
  const imagePath = path.join(__dirname, 'astronomy_image.jpg');
  const imageReadStream = fs.createReadStream(imagePath);
  imageReadStream.pipe(res);
}
function handle404Error(res) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/html');
  const notFoundHtmlPath = path.join(__dirname, '404.html');
  const notFoundReadStream = fs.createReadStream(notFoundHtmlPath, 'utf-8');
  notFoundReadStream.pipe(res);
}
module.exports = {
  handleHomePage,
  handleAstronomyPage,
  handleCSS,
  handle404Error,
  handleImage,
};
