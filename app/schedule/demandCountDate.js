const Subscription = require('egg').Subscription;

class demandCountDate extends Subscription {
  static get schedule() {
    return {
      type: 'worker',
      cron: '0 0 1 */1 * ?'
    };
  }

  * subscribe () {
    yield this.ctx.service.statistics.demandCountDate();
  }
}

module.exports = demandCountDate;
