const xlsx = require('xlsx');
const fs = require('fs');

module.exports = app => {
    class Excel extends app.Service {
        * read(stream) {
            const head = stream._readableState.buffer.tail.data;
            const content = xlsx.read(head,{type:'buffer'});
            return {
                xlsx:content,
            }
        }
    }
    return Excel;
}