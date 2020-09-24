'use strict';

module.exports = (app) => {
  class StatisticsController extends app.Controller {
    // 需求数日报表
    * demandCountDate () {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.DemandCountDateStat.getDemandCountStat(ctx.query);
    }

    // 规格报表
    * specCountMonth () {
      const ctx = this.ctx;
      if (ctx.query.type.indexOf('COUNT') > -1) {
        ctx.body = yield ctx.model.DemandCountDateStat.getSpecCount(ctx.query);
      } else {
        ctx.body = yield ctx.model.DemandCountDateStat.getSpecWeight(ctx.query);
      }
    }
  }
  return StatisticsController;
};
