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
      ctx.body = yield app.model.Invoice.createOneInvoice(ctx.request.body);
    }

    * list () {
      const { ctx } = this;
      ctx.body = yield app.model.Invoice.invoiceList(ctx.query);
    }

    * detail () {
      const { ctx } = this;
      ctx.body = yield app.model.Invoice.invoiceInfo(ctx.query);
    }

    * update () {
      const { ctx } = this;
      ctx.body = yield app.model.Invoice.updateInvoice(ctx.request.body);
    }

    * listForZeus () {
      const { ctx } = this;
      const userRole = ctx.cookies.get('userRole');
      if (userRole.charAt(8) === '0') {
        ctx.body = {
          code: -1,
          msg: '抱歉，没有权限进行该操作'
        };
      } else {
        ctx.body = yield app.model.Invoice.invoiceList(ctx.query);
      }
    }

    * updateForZeus () {
      const { ctx } = this;
      const userRole = ctx.cookies.get('userRole');
      if (userRole.charAt(8) === '0') {
        ctx.body = {
          code: -1,
          msg: '抱歉，没有权限进行该操作'
        };
      } else {
        ctx.body = yield app.model.Invoice.updateInvoiceForZues(ctx.request.body);
      }
    }
	}

  return invoiceController;
};