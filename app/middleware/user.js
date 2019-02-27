'use strict';

/**
 * 获取最大有效时间
 * @return {string} timestamp 时间戳
 */
function getMaxAge() {
  var now = new Date();
  var year = now.getFullYear();
  var m = now.getMonth() + 1;
  var d = now.getDate();
  var month = m > 9 ? m : `0${m}`;
  var date = d > 9 ? d : `0${d}`;

  return new Date(`${year}-${month}-${date} 23:59:59`).getTime() - now.getTime();
}

const filters = [
  '/user/login',
  '/user/logout',
  '/user/openid'
];

module.exports = (options) => function* user(next) {
  var userId = this.cookies.get('userId');
  var comId = this.cookies.get('comId');
  var tempComId = this.cookies.get('dataSource');
  var userToken = this.cookies.get('userToken');
  userId = decodeURI(`${userId}`);
  if (!filters.some((item) => this.request.url.includes(item))) {
    if (userId && comId) {
      const role = yield this.app.model.Userrole.getUserRole({userId, comId});
      this.cookies.set('userRole', role, {
        maxAge: getMaxAge(), // cookie有效期为1天
        httpOnly: false
      });
      this.query = this.query ? Object.assign(this.query, {userId, comId, role, tempComId, userToken}) : this.query;
      this.query && this.query.pageSize ? this.query.pageSize -= 0 : '';
      this.request.body = this.request.body ? Object.assign(this.request.body, {userId, comId, role, tempComId}) : this.request.body;
      yield next;
    } else {
      this.body = {
        code: 200,
        msg: '登录过期',
        data: {
          totalCount: 0,
          row: [],
          page: 1,
          pageSize: 15
        }
      };
    }
  } else {
    yield next;
  }

};