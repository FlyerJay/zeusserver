'use strict';

module.exports = app => {
  app.get('/zues/api/', 'home.index');
  app.post('/zues/api/upload/excel', 'upload.excel');
  app.post('/zues/api/user/register', 'user.register');
  app.post('/zues/api/user/login', 'user.login');
  app.get('/zues/api/user/register', 'user.register');
  app.get('/zues/api/user/login', 'user.login');
};
