const xlsx = require('node-xlsx');
const fs = require('fs');

module.exports = app => {
    class Excel extends app.Service {
        * read(stream) {
            //console.log(stream);
            var fileStream = fs.readFileSync('D://excel.xlsx',{},function(err,data){
                console.log(data);
            });
            const workSheetsFromBuffer = xlsx.parse(stream);
            return {
                xlsx:workSheetsFromBuffer
            }
        }
    }
    return Excel;
}