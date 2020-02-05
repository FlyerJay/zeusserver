/**
 * @author flyerjay
 * 2020-02-05
 * 发票控制类
 */

'use strict';

module.exports = (app) => {
  class invoiceController extends app.Controller {
    * create () {
      const { ctx } = this;
      ctx.body = yield app.model.Invoice.createOneInvoince(ctx.request.body);
    }

    * list () {
      const { ctx } = this;
      ctx.body = yield app.model.Invoice.invoiceList(ctx.query);
    }
	}

  return invoiceController;
};