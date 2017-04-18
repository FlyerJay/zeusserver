'use strict';

module.exports = app => {
  class UserController extends app.Controller {
    * login() {
        let result = {};
        const ctx = this.ctx;
        result = yield ctx.model.User.userLogin(ctx.request.body);
        ctx.body = result;
    };
    * register() {
        let result = {};
        const ctx = this.ctx;
        result = yield ctx.model.User.registeUser(ctx.request.body);
        ctx.body = result;
    }
  }
  return UserController;
};
