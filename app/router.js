'use strict';

module.exports = app => {
  app.beforeStart(async function(){
      await app.model.sync();
  });
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
  app.post('/zues/api/supplier/remove','supplier.remove');
  //供应商库存
  app.get('/zues/api/inventory/list','inventory.list');
  app.post('/zues/api/inventory/add','inventory.add');
  app.post('/zues/api/inventory/update','inventory.update');
  app.post('/zues/api/inventory/remove','inventory.remove');
  //供应商价格
  app.get('/zues/api/price/list','price.list');
  app.post('/zues/api/price/add','price.add');
  app.post('/zues/api/price/update','price.update');
  app.post('/zues/api/price/remove','price.remove');
};
