'use strict';

module.exports = app => {
  class MessageController extends app.Controller {
    * list() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.Message.list(ctx.query);
    }
  }
  return MessageController;
};
