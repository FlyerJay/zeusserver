'use strict';

module.exports = app => {
  class UserController extends app.Controller {
    * login() {
        this.ctx.body = {
            state:200,
        }
    }
  }
  return UserController;
};
