'use strict'

module.exports = options => {
    return function* user(next) {
        var userId = this.cookies.get('userId');
        var comId = this.cookies.get('comId');
        userId = new Buffer(`${userId}`,'base64').toString('utf-8');
        if(!/\/user\/login/.test(this.request.url)){
            if(userId&&comId){
                const role = yield this.app.model.Userrole.getUserRole({userId,comId});
                this.cookies.set('userRole',role,{
                    maxAge: 30 * 24 * 3600 * 1000,//cookie有效期为1个月
                    httpOnly: false,
                })
                this.query = this.query?Object.assign(this.query,{userId,comId,role}):this.query
                this.request.body = this.request.body?Object.assign(this.request.body,{userId,comId,role}):this.request.body
                yield next;
            }else{
                this.body = {
                    code:200,
                    msg:"登录过期",
                    data:{
                        totalCount:0,
                        row:[],
                        page:1,
                        pageSize:30,
                    }
                }
            }
        }else{
            yield next
        }
        
    };
};