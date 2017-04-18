'use strict';

module.exports = app => {
  class UserController extends app.Controller {
    * login() {
        console.log(this);
        this.ctx.body = {
            state:200,
        }
    };
    * register() {
        let result = {};
        result = this.ctx.model.User.registeUser(this.ctx.request);
        this.ctx.body = this.ctx;
    }
  }
  return UserController;
};
