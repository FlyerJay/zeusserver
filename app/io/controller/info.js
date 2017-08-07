'use strict';
var record = require('../record');

 module.exports = app => {
    return function* (){
        const message = this.args[0];
        this.socket.emit('res','您已成功接入消息中心');
    }
 }