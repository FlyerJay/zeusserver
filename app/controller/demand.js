'use strict';

module.exports = app => {
  class DemandController extends app.Controller {
    * list() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.Demand.list(ctx.query);
    };
    * add() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.Demand.add(ctx.request.body);
    }
    * update() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.Demand.update(ctx.request.body);
    }
    * remove(){
      const ctx = this.ctx;
      ctx.body = yield ctx.model.Demand.remove(ctx.request.body);
    }
  }
  return DemandController;
};
