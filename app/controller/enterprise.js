/**
 * @author flyerjay
 * 2019-02-04
 * 外部企业控制器
 */

'use strict';

module.exports = (app) => {
  class enterpriseController extends app.Controller {
    * create () {
      const { ctx } = this;
      ctx.body = yield app.model.Enterprise.createOneEnt(ctx.request.body);
    }

    * bind () {
      const { ctx } = this;
      ctx.body = yield app.model.Enterprise.changeBind(ctx.request.body);
    }
  }

  return enterpriseController;
};