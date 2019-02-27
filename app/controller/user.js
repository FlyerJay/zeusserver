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

module.exports = (app) => {
  class UserController extends app.Controller {
    // 用户登录
    * login() {
      const ctx = this.ctx;
      const user = yield ctx.model.User.userLogin(ctx.request.body);
      var maxAge = getMaxAge();
      if (user.code === 200) {
        var info = user.data.userInfo.dataValues;
        for (var props in info) {
          if (props === 'userId') {
            ctx.cookies.set(`${props}`, encodeURI(`${info[props]}`).toString('base64'), {
              maxAge: maxAge, // cookie有效期为1个月
              httpOnly: false
            });
          } else if (props === 'comId' || props === 'userToken') {
            ctx.cookies.set(`${props}`, `${info[props]}`, {
              maxAge: maxAge, // cookie有效期为1个月
              httpOnly: false
            });
          }
        }
        var _role = user.data.userRole.dataValues;
        var role = `${_role['adminAuth']}${_role['valueAuth']}${_role['inventoryAuth']}${_role['supplierAuth']}${_role['demandAuth']}${_role['orderAuth']}${_role['queryAuth']}${_role['crossAuth']}`;
        ctx.cookies.set('userRole', role, {
          maxAge: maxAge, // cookie有效期为1个月
          httpOnly: false
        });
      }
      ctx.body = user;
    };
    // 用户注册
    * register() {
      const ctx = this.ctx;
      const user = yield ctx.model.User.registeUser(ctx.request.body);
      ctx.body = user;
    };
    // 重置用户密码
    * reset() {
      const ctx = this.ctx;
      const userRole = ctx.cookies.get('userRole');
      if (userRole.charAt(0) === '0' && userRole.charAt(7) === '0') {
        ctx.body = {
          code: -1,
          msg: '抱歉，没有权限进行该操作!'
        };
      } else {
        ctx.body = yield ctx.model.User.resetPassword(ctx.request.body);
      }
    };
    // 获取用户信息
    * info() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.User.getUserInfo(ctx.query);
    };
    // 远程校验用户是否已存在
    * validate() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.User.validateUserId(ctx.query);
    };
    // 删除用户
    * remove() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.User.removeUser(ctx.request.body);
    };
    // 退出登录
    logout() {
      const ctx = this.ctx;
      ctx.cookies.set('userId', null);
      ctx.cookies.set('comId', null);
      ctx.cookies.set('userToken', null);
      ctx.cookies.set('userRole', null);
      ctx.body = {
        code: 200,
        msg: '成功退出登录'
      };
    };
    // 绑定用户
    * bind() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.User.bindWxAccount(ctx.request.body);
    };
    // 查询openid
    * openid() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.User.getWxOpenId(ctx.query);
    };
    // 使用openid登录
    * loginByOpenid() {
      const ctx = this.ctx;
      var user = yield ctx.model.User.loginByOpenId(ctx.request.body);
      var maxAge = getMaxAge();
      if (user.code === 200) {
        var info = user.data.userInfo.dataValues;
        for (var props in info) {
          if (props === 'userId') {
            ctx.cookies.set(`${props}`, encodeURI(`${info[props]}`).toString('base64'), {
              maxAge: maxAge, // cookie有效期为1个月
              httpOnly: false
            });
          } else if (props === 'comId' || props === 'userToken') {
            ctx.cookies.set(`${props}`, `${info[props]}`, {
              maxAge: maxAge, // cookie有效期为1个月
              httpOnly: false
            });
          }
        }
        var _role = user.data.userRole.dataValues;
        var role = `${_role['adminAuth']}${_role['valueAuth']}${_role['inventoryAuth']}${_role['supplierAuth']}${_role['demandAuth']}${_role['orderAuth']}${_role['queryAuth']}${_role['crossAuth']}`;
        ctx.cookies.set('userRole', role, {
          maxAge: maxAge, // cookie有效期为1个月
          httpOnly: false
        });
      }
      ctx.body = user;
    }
  }
  return UserController;
};
