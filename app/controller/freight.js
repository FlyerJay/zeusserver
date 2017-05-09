'use strict';

module.exports = app => {
  class FreightController extends app.Controller {
    * list() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.Freight.list(ctx.query);
    }
    * update() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.Freight.update(ctx.request.body);
    }
    * add() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.Freight.add(ctx.request.body);
    }
    * remove() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.Freight.remove(ctx.request.body);
    }
  }
  return FreightController;
};
