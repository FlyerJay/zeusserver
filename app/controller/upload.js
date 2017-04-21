'use strict';

const sendToWormhole = require('stream-wormhole');
const path = require('path');
const fs = require('fs');

module.exports = app => {
    class UploadController extends app.Controller {
        * excel() {
            const parts = this.ctx.multipart();
            let part;
            while ((part = yield parts) != null) {
                if (Array.isArray(part)) {
                    continue;
                } else {
                    break;
                }
            }
            if (!part || !part.filename) {
                this.ctx.body = {
                    code:-1,
                    msg: '文件为空',
                };
                return;
            }
            this.ctx.body = yield this.ctx.service.excel.read(part);
        };
    }
    return UploadController;
};
