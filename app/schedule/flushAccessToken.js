const Subscription = require('egg').Subscription;

class flushAccessToken extends Subscription {
  // 每小时更新一下access_token
  static get schedule() {
    return {
      type: 'worker',
      interval: '1h'
    };
  }

  * subscribe () {
    yield this.ctx.service.express.updateAccessToken();
  }
}

module.exports = flushAccessToken;
