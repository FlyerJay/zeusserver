'use strict';
var record = require('../record');

 module.exports = app => {
    return function* (){
        const message = this.args[0];
        this.socket.emit('res','您已成功连入需求房间');
    }
 }