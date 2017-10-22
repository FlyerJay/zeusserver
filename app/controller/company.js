'use strict';

module.exports = app => {
  class CompanyController extends app.Controller {
    * list() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.Company.getList();
    }
    * defaultdata() {
      const ctx = this.ctx;
      ctx.cookies.set('dataSource',ctx.request.body.dataSource,{
        httpOnly: false,
      })
      ctx.body = {
        code: 200,
        msg: "设置成功"
      }
    }
  }
  return CompanyController;
};
