const fs = require('fs');

function handleHomePage(req, res) {
  const todosReadStream = fs.createReadStream('/home/asherif/NodeJS/Lab2/todos.json', 'utf-8');
  let todosData = '';

  todosReadStream.on('data', (chunk) => {
    todosData += chunk;
  });

  todosReadStream.on('end', () => {
    const todos = JSON.parse(todosData);
    const todosHtmlFilePath = '/home/asherif/NodeJS/Lab2/views/todos.html';
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
  const astronomyReadStream = fs.createReadStream('/home/asherif/NodeJS/Lab2/views/astronomy.html', 'utf-8');
  astronomyReadStream.pipe(res);
}

function handleCSS(req, res) {
  res.setHeader('Content-Type', 'text/css');
  if (req.url === '/todos.css') {
    const cssReadStream = fs.createReadStream('/home/asherif/NodeJS/Lab2/public/styles/todos.css', 'utf-8');
    cssReadStream.pipe(res);
  } else {
    const cssReadStream = fs.createReadStream('/home/asherif/NodeJS/Lab2/public/styles/style.css', 'utf-8');
    cssReadStream.pipe(res);
  }
}
function handleImage(req, res) {
  res.setHeader('Content-Type', 'image/jpg');
  const imageReadStream = fs.createReadStream('/home/asherif/NodeJS/Lab2/public/styles/astronomy_image.jpg');
  imageReadStream.pipe(res);
}
function handle404Error(res) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/html');
  const notFoundReadStream = fs.createReadStream('/home/asherif/NodeJS/Lab2/views/404.html', 'utf-8');
  notFoundReadStream.pipe(res);
}
module.exports = {
  handleHomePage,
  handleAstronomyPage,
  handleCSS,
  handle404Error,
  handleImage,
};
