'use strict'

module.exports = options => {
    return function* user(next) {
        var userId = this.cookies.get('userId');
        var comId = this.cookies.get('comId');
        var role = this.cookies.get('userRole');
        this.query = this.query?Object.assign(this.query,{userId,comId,role}):this.query
        this.request.body = this.request.body?Object.assign(this.request.body,{userId,comId,role}):this.request.body
        yield next;
    };
};