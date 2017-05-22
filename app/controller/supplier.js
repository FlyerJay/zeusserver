'use strict';

module.exports = app => {
  class SupplierController extends app.Controller {
    * list() {
      const ctx = this.ctx;
      console.log(ctx.cookies.get('userToken'));
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
    * remove() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.Supplier.remove(ctx.request.body);
    }
    * address() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.Supplier.address(ctx.query);
    }
  }
  return SupplierController;
};
