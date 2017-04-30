'use strict';

module.exports = app => {
  class ChartController extends app.Controller {
    * list() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.Chart.getList();
    }
  }
  return ChartController;
};
