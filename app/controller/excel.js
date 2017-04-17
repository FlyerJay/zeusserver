'use strict';

module.exports = app => {
  class ExcelController extends app.Controller {
    * index() {
      const xlsxInfo = yield this.ctx.service.excel.read();
      this.ctx.body = xlsxInfo
    }
  }
  return ExcelController;
};
