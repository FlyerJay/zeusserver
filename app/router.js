'use strict';

module.exports = app => {
  app.get('/api/', 'home.index');
  app.post('/api/upload/excel', 'upload.excel');
  app.post('/api/user/register', 'user.register');
  app.post('/api/user/login', 'user.login');
};
