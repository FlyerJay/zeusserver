'use strict';

module.exports = app => {
  class UserController extends app.Controller {
    * login() {
      const ctx = this.ctx;
      const user =  yield ctx.model.User.userLogin(ctx.request.body);
      if(user.code == 200){
        var info = user.data.userInfo.dataValues;
        for(var props in info){
          if(props == 'userId' || props == 'comId' || props == 'userToken'){
            ctx.cookies.set(`${props}`,`${info[props]}`,{
              maxAge: 30 * 24 * 3600 * 1000,//cookie有效期为1个月
            })
          }
        }
        var _role = user.data.userRole.dataValues;
        var role = `${_role['adminAuth']}${_role['valueAuth']}${_role['inventoryAuth']}${_role['supplierAuth']}${_role['demandAuth']}${_role['orderAuth']}`;
        ctx.cookies.set('userRole',role)
      }
      ctx.body = user;
    };
    * register() {
		  const ctx = this.ctx;
      const user =  yield ctx.model.User.userLogin(ctx.request.body);
      ctx.body = user;
    };
    * info() {
      const ctx = this.ctx;
      ctx.body = yield ctx.model.User.getUserInfo(ctx.query);
    };
    * validate() {
		  const ctx = this.ctx;
		  ctx.body = yield ctx.model.User.validateUserId(ctx.query);
	  };
    * logout() {
      const ctx = this.ctx;
      ctx.cookies.set('userId',null);
      ctx.cookies.set('comId',null);
      ctx.cookies.set('userToken',null);
      ctx.cookies.set('userRole',null);
      ctx.body = {
        code:200,
        msg:"成功退出登录"
      }
    }
  }
  return UserController;
};
