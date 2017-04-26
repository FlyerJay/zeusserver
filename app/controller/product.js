'use strict';

module.exports = app => {
  class ProductController extends app.Controller {
    * list() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.SupplierInventory.getList(ctx.query);
    }
  }
  return ProductController;
};
