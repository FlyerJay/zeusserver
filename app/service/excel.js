const xlsx = require('node-xlsx');
const fs = require('fs');

module.exports = app => {
    class Excel extends app.Service {
        * read(stream) {
            console.log(this.ctx.params);
            console.log(stream._readableState.buffer.tail.data);
            const head = stream._readableState.buffer.tail.data;
            const content = xlsx.parse(head);
            return {
                xlsx:content,
            }
        }
    }
    return Excel;
}