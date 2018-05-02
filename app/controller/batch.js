'use strict';

module.exports = app => {
  class batchController extends app.Controller {
    * batch() {//添加地址
        const ctx = this.ctx;
        console.log()
        ctx.body = yield ctx.model.Batch.batch(ctx.request.body);
    }
  }
  return batchController;
};
