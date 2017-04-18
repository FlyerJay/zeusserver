'use strict';

module.exports = app => {
  class HomeController extends app.Controller {
    * index() {
      const { ctx } = this;
      ctx.body = ctx;
    }
  }
  return HomeController;
};
