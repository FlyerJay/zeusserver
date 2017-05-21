'use strict';

module.exports = app => {
  class ChartController extends app.Controller {
    * list() {//查询购物车列表
      const ctx = this.ctx;
      ctx.body = yield ctx.model.Chart.getList(ctx.query);
    }
    * addToChart() {//添加到购物车
      const ctx = this.ctx;
      ctx.body = yield ctx.model.Chart.add(ctx.request.body);
    }
    * remove() {//从购物车中删除
      const ctx = this.ctx;
      ctx.body = yield ctx.model.Chart.remove(ctx.request.body);
    }
    * update() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.Chart.update(ctx.request.body);
    }
  }
  return ChartController;
};
