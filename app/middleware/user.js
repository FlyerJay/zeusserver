'use strict'

module.exports = options => {
    return function* user(next) {
        var userId = this.cookies.get('userId');
        var comId = this.cookies.get('comId');
        var role = this.cookies.get('userRole');
        if(!/\/user\/login/.test(this.request.url)){
            if(userId&&comId&&role){
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