'use strict';

module.exports = app => {
  class OrderController extends app.Controller {
    * list() {//查询购物车列表
      const ctx = this.ctx;
      const userRole = ctx.cookies.get('userRole');
      if(userRole.charAt(6) === '0' && userRole.charAt(5) === '0'){
        ctx.body = {
          code:-1,
          msg:"抱歉，没有权限进行该操作"
        }
      }else{
        ctx.body = yield ctx.model.Order.orderList(ctx.query);
      }
    }
    * add() {//添加到购物车
      const ctx = this.ctx;
      const userRole = ctx.cookies.get('userRole');
      if(userRole.charAt(5) === '0'){
        ctx.body = {
          code:-1,
          msg:"抱歉，没有权限进行该操作"
        }
      }else{
        ctx.body = yield ctx.model.Order.addOrder(ctx.request.body);
      }
    }
    * remove() {//从购物车中删除
      const ctx = this.ctx;
      const userRole = ctx.cookies.get('userRole');
      if(userRole.charAt(5) === '0'){
        ctx.body = {
          code:-1,
          msg:"抱歉，没有权限进行该操作"
        }
      }else{
        ctx.body = yield ctx.model.Order.removeOrder(ctx.request.body);
      }
    }
    * detail() {
      const ctx = this.ctx;
      const userRole = ctx.cookies.get('userRole');
      if(userRole.charAt(5) === '0' && userRole.charAt(6) === '0'){
        ctx.body = {
          code:-1,
          msg:"抱歉，没有权限进行该操作"
        }
      }else{
        ctx.body = yield ctx.model.Order.orderDetail(ctx.query);
      }
    }
    * print() {
      const ctx = this.ctx;
      const userRole = ctx.cookies.get('userRole');
      if(userRole.charAt(5) === '0'){
        ctx.body = {
          code:-1,
          msg:"抱歉，没有权限进行该操作"
        }
      }else{
        ctx.body = yield ctx.service.export.orderPrint(ctx.request.body);
      }
    }
    * update() {
      const ctx = this.ctx;
      const userRole = ctx.cookies.get('userRole');
      if(userRole.charAt(5) === '0'){
        ctx.body = {
          code:-1,
          msg:"抱歉，没有权限进行该操作"
        }
      }else{
        ctx.body = yield ctx.model.OrderDetail.updateDetail(ctx.request.body);
      }
    }
  }
  return OrderController;
};
