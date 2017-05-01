'use strict';

module.exports = app => {
  class ChartController extends app.Controller {
    * list() {//查询购物车列表
      const ctx = this.ctx;
      ctx.body = yield ctx.model.Chart.getList(ctx.request.body);
    }
    * addToChart() {//添加到购物车
        const ctx = this.ctx;
        ctx.body = yield ctx.model.Chart.add(ctx.request.body);
    }
  }
  return ChartController;
};
