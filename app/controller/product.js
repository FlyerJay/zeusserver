'use strict';

module.exports = app => {
  class ProductController extends app.Controller {
    * list() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.SupplierInventory.queryProduct(ctx.query);
    }
  }
  return ProductController;
};
