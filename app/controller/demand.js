'use strict';

module.exports = app => {
  class DemandController extends app.Controller {
    * list() {//查看操作记录
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
      ctx.body = yield ctx.model.Demand.remove(ctx.query);
    }
  }
  return DemandController;
};
