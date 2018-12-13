'use strict'

function getMaxAge() {
    var now = new Date()
    var year = now.getFullYear()
    var m = now.getMonth() + 1
    var d = now.getDate()
    var month = m > 9 ? m : `0${m}`
    var date = d > 9 ? m : `0${d}`

//   return new Date(`${year}-${month}-${date} 23:59:59`).getTime() - now.getTime()
    return 24 * 60 * 60 * 1000
}

module.exports = options => {
    return function* user(next) {
        var userId = this.cookies.get('userId');
        var comId = this.cookies.get('comId');
        var tempComId = this.cookies.get('dataSource');
        userId = decodeURI(`${userId}`);
        if(!/\/user\/login/.test(this.request.url) && !/\/user\/logout/.test(this.request.url)){
            if(userId&&comId){
                const role = yield this.app.model.Userrole.getUserRole({userId,comId});
                this.cookies.set('userRole',role,{
                    maxAge: getMaxAge(),//cookie有效期为1天
                    httpOnly: false,
                })
                this.query = this.query?Object.assign(this.query,{userId,comId,role,tempComId}):this.query
                this.query && this.query.pageSize ? this.query.pageSize -= 0: "";
                this.request.body = this.request.body?Object.assign(this.request.body,{userId,comId,role,tempComId}):this.request.body
                yield next;
            }else{
                this.body = {
                    code:200,
                    msg:"登录过期",
                    data:{
                        totalCount:0,
                        row:[],
                        page:1,
                        pageSize:15,
                    }
                }
            }
        }else{
            yield next
        }
        
    };
};