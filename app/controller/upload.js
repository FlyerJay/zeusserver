'use strict';

const path = require('path');
const sendToWormhole = require('stream-wormhole');
var formidable = require('formidable');  
var fs = require('fs')
const xlsx = require('xlsx');

module.exports = app => {
  class UploadController extends app.Controller {
    excel(uid) {
        const ctx = this.ctx;
        var fileTypeError = false;  
        var target_path = path.resolve(__dirname, '../../upload/');  
        var form = new formidable.IncomingForm();  
        form.encoding = 'utf-8';  
        form.keepExtensions = true;  
        form.maxFieldsSize = 10 * 1024 * 1024;  
        form.uploadDir = target_path; 
    
        var fields = [];  
        var files = [];  
        ctx.body = {code:1};
    
        form.on('field', function (field, value) {  
            fields.push([field, value]);  
        });  
        form.on('file', function (field, file) {  
            files.push([field, file]);  
        });  
    
        form.on('end', function () {  
            var fileName = '';  
            var obj = '';  
            var folder_exists = fs.existsSync(target_path);  
            if (folder_exists) {  
                var dirList = fs.readdirSync(target_path);  
                dirList.forEach(function (item) {  
                    if (!fs.statSync(target_path + '/' + item).isDirectory()) {  
                        fileName = target_path + '/' + item;  
                        obj = xlsx.readFile(fileName); 
                        fs.unlink(fileName);  
                    }  
                });  
                ctx.body = {"rtnCode": "0", "rtnInfo": "成功导入数据"};  
            }else{  
                ctx.body = {"rtnCode": "1", "rtnInfo": "系统错误"};  
            }  
    
        });  
        form.on('error', function(err) {  
            ctx.body = {"rtnCode": "1", "rtnInfo": "上传出错"};  
        });  
        form.on('aborted', function() {  
            ctx.body = {"rtnCode": "1", "rtnInfo": "放弃上传"};  
        });  
        form.parse(ctx.req); 
    }
  }
  return UploadController;
};
