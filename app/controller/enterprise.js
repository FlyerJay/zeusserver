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

    * search () {
      const { ctx } = this;
      ctx.body = yield app.model.Enterprise.matchList(ctx.query);
    }

    * update () {
      const { ctx } = this;
      ctx.body = yield app.model.Enterprise.updateEnt(ctx.request.body);
    }

    * list () {
      const { ctx } = this;
      ctx.body = yield app.model.Enterprise.entList(ctx.query);
    }
  }

  return enterpriseController;
};