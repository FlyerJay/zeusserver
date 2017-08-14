'use strict';

module.exports = app => {
  class ChartController extends app.Controller {
    * list() {//查询购物车列表
      const ctx = this.ctx;
      const userRole = ctx.cookies.get('userRole');
      if(userRole.charAt(6) === '0' && userRole.charAt(5) === '0'){
        ctx.body = {
          code:-1,
          msg:"抱歉，没有权限进行该操作"
        }
      }else{
        ctx.body = yield ctx.model.Chart.getList(ctx.query);
      }
    }
    * addToChart() {//添加到购物车
      const ctx = this.ctx;
      const userRole = ctx.cookies.get('userRole');
      const comId = ctx.cookies.get('comId');
      if(userRole.charAt(5) === '0'){
        ctx.body = {
          code:-1,
          msg:"抱歉，没有权限进行该操作"
        }
      }else{
        var res = yield ctx.model.Chart.add(ctx.request.body);
        ctx.body = res;
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
        ctx.body = yield ctx.model.Chart.remove(ctx.request.body);
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
        ctx.body = yield ctx.model.Chart.update(ctx.request.body);
      }
    }
  }
  return ChartController;
};
