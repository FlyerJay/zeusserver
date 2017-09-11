'use strict';

module.exports = app => {
  class customerController extends app.Controller {
    * add() {
        const ctx = this.ctx;
        ctx.body = yield ctx.model.Customer.add(ctx.request.body);
    }
    * remove() {
        const ctx = this.ctx;
        ctx.body = yield ctx.model.Customer.remove(ctx.request.body);
    }
    * list() {
        const ctx = this.ctx;
        ctx.body = yield ctx.model.Customer.getList(ctx.query);
    }
  }
  return customerController;
};
