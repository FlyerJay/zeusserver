'use strict';

module.exports = app => {
  app.get('/zues/api/', 'home.index');
  //文件上传
  app.post('/zues/api/upload/excel', 'upload.excel');
  //用户
  app.post('/zues/api/user/register', 'user.register');
  app.post('/zues/api/user/login', 'user.login');
  app.get('/zues/api/user','user.info');
  app.get('/zues/api/user/validate','user.validate');
  //公司
  app.get('/zues/api/company','company.list');
  //供应商
  app.get('/zues/api/supplier/list','supplier.list');
  app.post('/zues/api/supplier/update','supplier.update');
  app.post('/zues/api/supplier/add','supplier.add');
};
