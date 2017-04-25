'use strict';

const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

module.exports = app => {
    class Excel extends app.Service {
        * read(stream) {
            const extendsNameArr = stream.filename.split('.');
            const extendsName = extendsNameArr[extendsNameArr.length - 1];
            if(extendsName.indexOf('xls') < 0) return {
                code:-1,
                msg:'文件后缀必须是xls或xlsx'
            }
            const uniqueName = uuid.v4() + `.${extendsName}`;
            const filepath = path.resolve(__dirname,`../../upload/${uniqueName}`);
            const uploadRes = yield new Promise((resolve, reject) => {
                const ws = fs.createWriteStream(filepath);
                stream.pipe(ws);
                ws.on('error', ()=>{
                    resolve(false)
                });
                ws.on('finish', ()=>{
                    resolve(true);
                });
            })
            if(!uploadRes) return {
                code:-1,
                msg:'文件上传出错'
            }
            const workbook = yield new Promise((res,rej) => {
                var workbook = xlsx.readFile(filepath);
                fs.unlinkSync(filepath);//读完文件之后赶紧删掉不要被别人发现了
                res(workbook);
            })
            const result = yield new Promise((res,rej)=>{
                var result = [];
                workbook.SheetNames.forEach(function(sheetName) {
                    var csv = xlsx.utils.sheet_to_csv(workbook.Sheets[sheetName]);
                    if(csv.length > 0){
                        result.push("SHEET: " + sheetName);
                        result.push("");
                        result.push(csv);
                    }
                });
                res(result.join("\n"));
            })
            return result;
        }
    }
    return Excel;
}