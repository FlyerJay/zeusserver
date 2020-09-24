'use strict';

// const sendToWormhole = require('stream-wormhole');
// const path = require('path');
// const fs = require('fs');

module.exports = (app) => {
  class UploadController extends app.Controller {
    * excel() {
      const parts = this.ctx.multipart();
      let part;
      const ctx = this.ctx;
      const query = ctx.query;
      while ((part = yield parts) != null) {
        if (Array.isArray(part)) {
          continue;
        } else {
          break;
        }
      }
      if (!part || !part.filename) {
        this.ctx.body = {
          code: -1,
          msg: '文件为空'
        };
        return;
      }
      const userRole = ctx.cookies.get('userRole');
      if (userRole.charAt(1) === '0' && !query.type) {
        ctx.body = {
          code: -1,
          msg: '抱歉，没有权限进行该操作'
        };
      } else if (userRole.charAt(2) === '0' && query.type === 'inventory') {
        ctx.body = {
          code: -1,
          msg: '抱歉，没有权限进行该操作'
        };
      } else {
        this.ctx.body = yield this.ctx.service.excel.read(part, ctx.query);
      }
    };
    }
  return UploadController;
};
