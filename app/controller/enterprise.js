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

    * remove () {
      const { ctx } = this;
      ctx.body = yield app.model.Enterprise.removeEnt(ctx.request.body);
    }

    * detail () {
      const { ctx } = this;
      ctx.body = yield app.model.Enterprise.queryEnt(ctx.query);
    }

    * companyList () {
      const { ctx } = this;
      ctx.body = yield app.model.Enterprise.companyList(ctx.query);
    }

    * listForZeus () {
      const { ctx } = this;
      ctx.body = yield app.model.Enterprise.entList(ctx.query);
    }

    * authForZeus () {
      const { ctx } = this;
      ctx.body = yield app.model.Enterprise.authEnt(ctx.request.body);
    }

    * qichachaSearch () {
      const { ctx } = this;
      ctx.body = yield ctx.service.qichacha.search(ctx.query.name);
    }
  }

  return enterpriseController;
};