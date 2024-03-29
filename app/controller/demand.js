'use strict';

module.exports = (app) => {
  class DemandController extends app.Controller {
    * list() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.Demand.list(ctx.query);
    };
    * detail() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.Demand.detail(ctx.query);
    };
    * priceList() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.Demand.priceList(ctx.query);
    };
    * add() {
      const ctx = this.ctx;
      const userRole = ctx.cookies.get('userRole');
      if (userRole.charAt(4) === '0') {
        ctx.body = {
          code: -1,
          msg: '抱歉，没有权限进行该操作'
        };
      } else {
        ctx.body = yield ctx.model.Demand.add(ctx.request.body);
      }
    }
    * submitUdapte() {
      const ctx = this.ctx;
      const userRole = ctx.cookies.get('userRole');
      if (userRole.charAt(4) === '0') {
        ctx.body = {
          code: -1,
          msg: '抱歉，没有权限进行该操作'
        };
      } else {
        ctx.body = yield ctx.model.Demand.submitUpdate(ctx.request.body);
      }
    }
    * price() {
      const ctx = this.ctx;
      const userRole = ctx.cookies.get('userRole');
      if (ctx.request.body.imp === 2) {
        if (userRole.charAt(4) === '0') {
          ctx.body = {
            code: -1,
            msg: '抱歉，没有权限进行该操作'
          };
        } else {
          ctx.body = yield ctx.model.Demand.price(ctx.request.body);
        }
      } else {
        if (userRole.charAt(5) === '0') {
          ctx.body = {
            code: -1,
            msg: '抱歉，没有权限进行该操作'
          };
        } else {
          ctx.body = yield ctx.model.Demand.price(ctx.request.body);
        }
      }
    }
    * save() {
      const ctx = this.ctx;
      const userRole = ctx.cookies.get('userRole');
      if (userRole.charAt(5) === '0') {
        ctx.body = {
          code: -1,
          msg: '抱歉，没有权限进行该操作'
        };
      } else {
        ctx.body = yield ctx.model.Demand.save(ctx.request.body);
      }
    }
    * update() {
      const ctx = this.ctx;
      const userRole = ctx.cookies.get('userRole');
      if (ctx.request.body.dealStatus) {
        if (userRole.charAt(4) === '0') {
          ctx.body = {
            code: -1,
            msg: '抱歉，没有权限进行该操作'
          };
        } else {
          ctx.body = yield ctx.model.Demand.update(ctx.request.body);
        }
      } else {
        if (userRole.charAt(4) === '0') {
          ctx.body = {
            code: -1,
            msg: '抱歉，没有权限进行该操作'
          };
        } else {
          ctx.body = yield ctx.model.Demand.update(ctx.request.body);
        }
      }
    }
    * remove() {
      const ctx = this.ctx;
      const userRole = ctx.cookies.get('userRole');
      if (userRole.charAt(4) === '0') {
        ctx.body = {
          code: -1,
          msg: '抱歉，没有权限进行该操作'
        };
      } else {
        ctx.body = yield ctx.model.Demand.remove(ctx.request.body);
      }
    }
    * priceHistory() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.DemandDetail.getHistory(ctx.query);
    }
    * checkRepeate() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.Demand.checkRepeate(ctx.request.body);
    }
  }
  return DemandController;
};
