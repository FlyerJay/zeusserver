'use strict';

module.exports = app => {
  class addressController extends app.Controller {
    * add() {//添加地址
        const ctx = this.ctx;
        ctx.body = yield ctx.model.Address.add(ctx.request.body);
    }
    * remove() {
        const ctx = this.ctx;
        ctx.body = yield ctx.model.Address.remove(ctx.request.body);
    }
    * setdefault() {
        const ctx = this.ctx;
        ctx.body = yield ctx.model.Address.setDefault(ctx.request.body);
    }
    * list() {
        const ctx = this.ctx;
        ctx.body = yield ctx.model.Address.list(ctx.query);
    }
    * defaultAddress() {
        const ctx = this.ctx;
        ctx.body = yield ctx.model.Address.defaultAddress(ctx.query);
    }
  }
  return addressController;
};
