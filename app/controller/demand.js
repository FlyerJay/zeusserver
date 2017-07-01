'use strict';

module.exports = app => {
  class DemandController extends app.Controller {
    * list() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.Demand.list(ctx.query);
    };
    * priceList() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.Demand.priceList(ctx.query);
    };
    * add() {
      const ctx = this.ctx;
      const userRole = ctx.cookies.get('userRole');
      if(userRole.charAt(4) === '0'){
        ctx.body = {
          code:-1,
          msg:"抱歉，没有权限进行该操作"
        }
      }else{
        ctx.body = yield ctx.model.Demand.add(ctx.request.body);
      }
    }
    * update() {
      const ctx = this.ctx;
      const userRole = ctx.cookies.get('userRole');
      if(ctx.request.body.dealStatus){
        if(userRole.charAt(4) === '0'){
          ctx.body = {
            code:-1,
            msg:"抱歉，没有权限进行该操作"
          }
        }else{
          ctx.body = yield ctx.model.Demand.update(ctx.request.body);
        }
      }else{
        if(userRole.charAt(5) === '0'){
          ctx.body = {
            code:-1,
            msg:"抱歉，没有权限进行该操作"
          }
        }else{
          ctx.body = yield ctx.model.Demand.update(ctx.request.body);
        }
      }
    }
    * remove(){
      const ctx = this.ctx;
      const userRole = ctx.cookies.get('userRole');
      if(userRole.charAt(4) === '0'){
        ctx.body = {
          code:-1,
          msg:"抱歉，没有权限进行该操作"
        }
      }else{
        ctx.body = yield ctx.model.Demand.remove(ctx.request.body);
      }
    }
  }
  return DemandController;
};
