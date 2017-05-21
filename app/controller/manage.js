'use strict';

module.exports = app => {
  class ManageController extends app.Controller {
    * operateList() {//查看操作记录
      const ctx = this.ctx;
      ctx.body = yield ctx.model.OperateRecord.list(ctx.query);
    };
    * updateUserRole() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.Userrole.update(ctx.request.body);
    }
    * orderVerify() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.Order.verify(ctx.request.body);
    }
  }
  return ManageController;
};
