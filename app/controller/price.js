'use strict';

module.exports = app => {
  class PriceController extends app.Controller {
    * list() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.SupplierValue.getList(ctx.query);
    }
    * update() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.SupplierValue.updateValue(ctx.request.body);
    }
    * add() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.SupplierValue.addValue(ctx.request.body);
    }
    * remove() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.SupplierValue.deleteValue(ctx.request.body);
    }
  }
  return PriceController;
};