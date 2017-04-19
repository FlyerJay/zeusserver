'use strict';

module.exports = app => {
  class CompanyController extends app.Controller {
    * list() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.Company.getList();
    }
  }
  return CompanyController;
};
