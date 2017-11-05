'use strict';

module.exports = app => {
  class MessageController extends app.Controller {
    * list() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.Message.list(ctx.query);
    }
    * add() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.Message.add(ctx.request.body);
    }
    * modify() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.Message.modify(ctx.request.body);
    }
    * delete() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.Message.delete(ctx.request.body);
    }
  }
  return MessageController;
};
