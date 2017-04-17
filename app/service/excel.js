const xlsx = require('node-xlsx');
const fs = require('fs');

module.exports = app => {
    class Excel extends app.Service {
        * read() {
            const workSheetsFromBuffer = xlsx.parse(fs.readFileSync(`D://excel.xlsx`));
            return {
                xlsx:workSheetsFromBuffer
            }
        }
    }
    return Excel;
}