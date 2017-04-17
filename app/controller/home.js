'use strict';

module.exports = app => {
  class HomeController extends app.Controller {
    * index() {
      this.ctx.body = 'hello, egg';
    }
  }
  return HomeController;
};
