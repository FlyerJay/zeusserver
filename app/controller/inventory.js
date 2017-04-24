'use strict';

module.exports = app => {
  class InventoryController extends app.Controller {
    * list() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.SupplierInventory.getList(ctx.query);
    }
    * update() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.SupplierInventory.updateInventory(ctx.request.body);
    }
    * add() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.SupplierInventory.addInventory(ctx.request.body);
    }
    * remove() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.SupplierInventory.deleteInventory(ctx.request.body);
    }
  }
  return InventoryController;
};
