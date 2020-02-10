'use strict';

module.exports = (app) => {
  class ManageController extends app.Controller {
    * operateList() {// 查看操作记录
      const ctx = this.ctx;
      const userRole = ctx.cookies.get('userRole');
      if (userRole.charAt(0) === '0') {
        ctx.body = {
          code: -1,
          msg: '抱歉，没有权限进行该操作'
        };
      } else {
        ctx.body = yield ctx.model.OperateRecord.list(ctx.query);
      }
    };
    * updateUserRole() {
      const ctx = this.ctx;
      const userRole = ctx.cookies.get('userRole');
      if (userRole.charAt(0) === '0') {
        ctx.body = {
          code: -1,
          msg: '抱歉，没有权限进行该操作'
        };
      } else {
        ctx.body = yield ctx.model.Userrole.update(ctx.request.body);
      }
    }
    * verifyList() {
      const ctx = this.ctx;
      const userRole = ctx.cookies.get('userRole');
      if (userRole.charAt(0) === '0' && userRole.charAt(7) === '0') {
        ctx.body = {
          code: -1,
          msg: '抱歉，没有权限进行该操作'
        };
      } else {
        ctx.body = yield ctx.model.Order.verifyList(ctx.query);
      }
    }
    * orderVerify() {
      const ctx = this.ctx;
      const userRole = ctx.cookies.get('userRole');
      if (userRole.charAt(7) === '0') {
        ctx.body = {
          code: -1,
          msg: '抱歉，没有权限进行该操作'
        };
      } else {
        ctx.body = yield ctx.model.Order.verify(ctx.request.body);
      }
    }
    * userRoleList() {
      const ctx = this.ctx;
      const userRole = ctx.cookies.get('userRole');
      if (userRole.charAt(0) === '0') {
        ctx.body = {
          code: -1,
          msg: '抱歉，没有权限进行该操作'
        };
      } else {
        ctx.body = yield ctx.model.Userrole.list(ctx.query);
      }
    }
  }
  return ManageController;
};
