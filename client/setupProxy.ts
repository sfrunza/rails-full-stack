const proxy = require('http-proxy-middleware');

module.exports = function (app: any) {
  app.use(proxy('/api/v1', { target: 'http://localhost:3001/' }));
};
