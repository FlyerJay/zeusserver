'use strict';

module.exports = app => {
  class SupplierController extends app.Controller {
    * list() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.Supplier.getList(ctx.query);
    }
    * update() {
      const ctx = this.ctx;
      const userRole = ctx.cookies.get('userRole');
      if(userRole.charAt(3) === '0'){
        ctx.body = {
          code:-1,
          msg:"抱歉，没有权限进行该操作"
        }
      }else{
        ctx.body = yield ctx.model.SupplierRelate.update(ctx.request.body);
      }
    }
    * add() {
      const ctx = this.ctx;
      const userRole = ctx.cookies.get('userRole');
      if(userRole.charAt(3) === '0'){
        ctx.body = {
          code:-1,
          msg:"抱歉，没有权限进行该操作"
        }
      }else{
        ctx.body = yield ctx.model.Supplier.add(ctx.request.body);
      }
    }
    * remove() {
      const ctx = this.ctx;
      const userRole = ctx.cookies.get('userRole');
      if(userRole.charAt(3) === '0'){
        ctx.body = {
          code:-1,
          msg:"抱歉，没有权限进行该操作"
        }
      }else{
        ctx.body = yield ctx.model.Supplier.remove(ctx.request.body);
      }
    }
    * open() {
      const ctx = this.ctx;
      const userRole = ctx.cookies.get('userRole');
      if(userRole.charAt(3) === '0'){
        ctx.body = {
          code:-1,
          msg:"抱歉，没有权限进行该操作"
        }
      }else{
        ctx.body = yield ctx.model.SupplierRelate.openRelate(ctx.request.body);
      }
    }
    * close() {
      const ctx = this.ctx;
      const userRole = ctx.cookies.get('userRole');
      if(userRole.charAt(3) === '0'){
        ctx.body = {
          code:-1,
          msg:"抱歉，没有权限进行该操作"
        }
      }else{
        ctx.body = yield ctx.model.SupplierRelate.closeRelate(ctx.request.body);
      }
    }
    * address() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.Supplier.address(ctx.query);
    }
  }
  return SupplierController;
};
