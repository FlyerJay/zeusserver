'use strict';

module.exports = (app) => {
  class carController extends app.Controller {
    * add() {// 添加地址
      const ctx = this.ctx;
      ctx.body = yield ctx.model.Car.add(ctx.request.body);
    }
    * remove() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.Car.remove(ctx.request.body);
    }
    * list() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.Car.list(ctx.query);
    }
  }
  return carController;
};
