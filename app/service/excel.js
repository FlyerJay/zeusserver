const xlsx = require('node-xlsx');
const fs = require('fs');

module.exports = app => {
    class Excel extends app.Service {
        * read(stream) {
            const head = stream._readableState.buffer.head.data;
            const content = xlsx.parse(head);
            return {
                xlsx:content,
            }
        }
    }
    return Excel;
}