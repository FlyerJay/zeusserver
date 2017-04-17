'use strict';

const path = require('path');
const sendToWormhole = require('stream-wormhole');

module.exports = app => {
  class UploadController extends app.Controller {
    * index(uid) {
        const stream = yield this.ctx.multipart();
        const name = 'egg-multipart-test/' + path.basename(stream.filename);
        // 文件处理，上传到云存储等等 
        let result;
        try {
            result = yield this.ctx.service.excel.read(stream);
        } catch (err) {
            // 必须将上传的文件流消费掉，要不然浏览器响应会卡死 
            yield sendToWormhole(stream);
            throw err;
        }
      
        this.ctx.body = result;
    }
  }
  return UploadController;
};
