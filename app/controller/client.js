/**
 * @author flyerjay
 * 2020-02-03
 * 开票客户控制
 */

'use strict';

module.exports = (app) => {
  class clientController extends app.Controller {
    * login () {
      const { ctx } = this;
      ctx.body = yield ctx.model.Client.authLogin(ctx.query);
    }

    * updateWechat () {
      const { ctx } = this;
      ctx.body = yield ctx.model.Client.updateWechat(ctx.request.body);
    }

    * userInfo () {
      const { ctx } = this;
      ctx.body = yield ctx.model.Client.userInfo(ctx.query);
    }
	}

  return clientController;
};