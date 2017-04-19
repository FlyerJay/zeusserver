'use strict';

module.exports = app => {
  class UserController extends app.Controller {
    * login() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.User.userLogin(ctx.request.body);
    };
    * register() {
		const ctx = this.ctx;
      ctx.body = yield ctx.model.User.registeUser(ctx.request.body);
    };
    * info() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.User.getUserInfo(ctx.query);
    };
    * validate() {
		  const ctx = this.ctx;
		  ctx.body = yield ctx.model.User.validateUserId(ctx.query);
	  }
  }
  return UserController;
};
