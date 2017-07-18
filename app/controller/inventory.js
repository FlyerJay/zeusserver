'use strict';

module.exports = app => {
  class InventoryController extends app.Controller {
    * list() {
      const ctx = this.ctx;
      const userRole = ctx.cookies.get('userRole');
      if(userRole.charAt(6) === '0'){
        ctx.body = {
          code:-1,
          msg:"抱歉，没有权限进行该操作"
        }
      }else{
        ctx.body = yield ctx.model.SupplierInventory.getList(ctx.query);
      }
    }
    * update() {
      const ctx = this.ctx;
      const userRole = ctx.cookies.get('userRole');
      if(userRole.charAt(2) === '0'){
        ctx.body = {
          code:-1,
          msg:"抱歉，没有权限进行该操作"
        }
      }else{
        ctx.body = yield ctx.model.SupplierInventory.updateInventory(ctx.request.body);
      }
    }
    * add() {
      const ctx = this.ctx;
      const userRole = ctx.cookies.get('userRole');
      if(userRole.charAt(2) === '0'){
        ctx.body = {
          code:-1,
          msg:"抱歉，没有权限进行该操作"
        }
      }else{
        ctx.body = yield ctx.model.SupplierInventory.addInventory(ctx.request.body);
      }
    }
    * remove() {
      const ctx = this.ctx;
      const userRole = ctx.cookies.get('userRole');
      if(userRole.charAt(2) === '0'){
        ctx.body = {
          code:-1,
          msg:"抱歉，没有权限进行该操作"
        }
      }else{
        ctx.body = yield ctx.model.SupplierInventory.deleteInventory(ctx.request.body);
      }
    }
  }
  return InventoryController;
};
