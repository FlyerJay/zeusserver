'use strict';

module.exports = (app) => {
  class StatisticsController extends app.Controller {
    // 需求数日报表
    * demandCountDate () {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.DemandCountDateStat.getDemandCountStat(ctx.query);
    }
  }
  return StatisticsController;
};
