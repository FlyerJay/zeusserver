'use strict';

module.exports = (app) => {
  class CdataController extends app.Controller {
    * value() {// 查询购物车列表
      const ctx = this.ctx;
      ctx.body = yield ctx.model.SupplierValue.history(ctx.query);
    }
  }
  return CdataController;
};
