'use strict';

module.exports = (app) => {
  class ExportController extends app.Controller {
    * order() {
      const ctx = this.ctx;
      ctx.body = yield this.ctx.service.export.order(ctx.query);
    }
    * orderDetail() {
      const ctx = this.ctx;
      ctx.body = yield this.ctx.service.export.orderDetail(ctx.query);
    }
    * orderDetailList() {
      const ctx = this.ctx;
      ctx.body = yield this.ctx.service.export.orderDetailList(ctx.query);
    }
    * demandExport() {
      const ctx = this.ctx;
      ctx.body = yield this.ctx.service.export.demandExport(ctx.query);
    }
    * demandList() {
      const ctx = this.ctx;
      ctx.body = yield this.ctx.service.export.demandList(ctx.query);
    }
    * demandDetailList() {
      const ctx = this.ctx;
      ctx.body = yield this.ctx.service.export.demandDetailExport(ctx.query);
    }
  }
  return ExportController;
};
