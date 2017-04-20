const xlsx = require('xlsx');
const fs = require('fs');

module.exports = app => {
    class Excel extends app.Service {
        * read(stream) {
            const head = stream._readableState.buffer.tail.data;
            //fs.writeFile(`D://temp.xlsx`,stream)
            //const content = xlsx.read(head,{type:'buffer'});
            //const content = xlsx.read(stream);
            return {
                xlsx:'11',
            }
        }
    }
    return Excel;
}