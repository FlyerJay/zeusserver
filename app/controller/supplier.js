'use strict';

module.exports = app => {
  class SupplierController extends app.Controller {
    * list() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.Supplier.getList(ctx.query);
    }
    * update() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.Supplier.update(ctx.request.body);
    }
    * add() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.Supplier.add(ctx.request.body);
    }
  }
  return SupplierController;
};
