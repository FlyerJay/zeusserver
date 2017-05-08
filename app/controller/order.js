'use strict';

module.exports = app => {
  class OrderController extends app.Controller {
    * list() {//查询购物车列表
      const ctx = this.ctx;
      ctx.body = yield ctx.model.Order.orderList(ctx.query);
    }
    * addOrder() {//添加到购物车
      const ctx = this.ctx;
      ctx.body = yield ctx.model.Order.addOrder(ctx.request.body);
    }
    * remove() {//从购物车中删除
      const ctx = this.ctx;
      ctx.body = yield ctx.model.Order.removeOrder(ctx.request.body);
    }
    * orderDetail() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.Order.orderDetail(ctx.query);
    }
  }
  return OrderController;
};
