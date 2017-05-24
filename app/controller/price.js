'use strict';

module.exports = app => {
  class PriceController extends app.Controller {
    * list() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.SupplierValue.getList(ctx.query);
    }
    * update() {
      const ctx = this.ctx;
      const userRole = ctx.cookies.get('userRole');
      if(userRole.charAt(1) === '0'){
        ctx.body = {
          code:-1,
          msg:"抱歉，没有权限进行该操作"
        }
      }else{
        ctx.body = yield ctx.model.SupplierValue.updateValue(ctx.request.body);
      }
    }
    * add() {
      const ctx = this.ctx;
      const userRole = ctx.cookies.get('userRole');
      if(userRole.charAt(1) === '0'){
        ctx.body = {
          code:-1,
          msg:"抱歉，没有权限进行该操作"
        }
      }else{
        ctx.body = yield ctx.model.SupplierValue.addValue(ctx.request.body);
      }
    }
    * remove() {
      const ctx = this.ctx;
      const userRole = ctx.cookies.get('userRole');
      if(userRole.charAt(1) === '0'){
        ctx.body = {
          code:-1,
          msg:"抱歉，没有权限进行该操作"
        }
      }else{
        ctx.body = yield ctx.model.SupplierValue.deleteValue(ctx.request.body);
      }
    }
    * adjust(){
      const ctx = this.ctx;
      const userRole = ctx.cookies.get('userRole');
      if(userRole.charAt(1) === '0'){
        ctx.body = {
          code:-1,
          msg:"抱歉，没有权限进行该操作"
        }
      }else{
        ctx.body = yield ctx.model.SupplierValue.adjustValue(ctx.request.body);
      }
    }
  }
  return PriceController;
};
