'use strict';

module.exports = app => {
  class ExportController extends app.Controller {
    * order(){
        const ctx = this.ctx;
        // ctx.response.setHeader({
        //     'contentType':'application/vnd.ms-excel'
        // })
        ctx.body = yield this.ctx.service.export.order(ctx.query);
    }
  }
  return ExportController;
};
