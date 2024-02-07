const http = require('http');

const {
  handleHomePage,
  handleAstronomyPage,
  handleCSS,
  handle404Error,
  handleImage,
} = require('./handlers');

const port = 3000;
const hostname = '127.0.0.1';

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    if (req.url === '/') {
      handleHomePage(req, res);
    } else if (req.url === '/astronomy') {
      handleAstronomyPage(req, res);
    } else if (req.url === '/todos.css' || req.url === '/style.css') {
      handleCSS(req, res);
    } else if (req.url === '/astronomy_image.jpg') {
      handleImage(req, res);
    } else {
      handle404Error(res);
    }
  }
});

server.listen(port, hostname, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running at http://${hostname}:${port}/`);
});
