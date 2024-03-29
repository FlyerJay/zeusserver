'use strict';

module.exports = (app) => {
  class ProductController extends app.Controller {
    * list() {
      const ctx = this.ctx;
      const userRole = ctx.cookies.get('userRole');
      if (userRole.charAt(2) === '0' && userRole.charAt(6) === '0') {
        ctx.body = {
          code: -1,
          msg: '抱歉，没有权限进行该操作'
        };
      } else {
        ctx.body = yield ctx.model.SupplierInventory.queryProduct(ctx.query);
      }
    };

    * kxlist() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.SupplierInventory.queryKxProduct(ctx.query);
    }
  }
  return ProductController;
};
