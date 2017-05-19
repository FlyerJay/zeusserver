'use strict';

const xlsx = require('../xlsx');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

module.exports = app => {
    class Excel extends app.Service {
        * read(stream,query) {
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
                        var resout = {};
                        resout.name = sheetName;
                        resout.content = csv;
                        result.push(resout);
                    }
                });
                res(result);
            })
            if(query && query.type == 'inventory'){
                return yield this.inventoryDispatch(result,query);
            }
            return yield this.valueParse(result,query);
            //return result;
        }
        * inventoryDispatch(options,query){
            const parseInventory = this.ctx.service.parseInventory;
            switch(query.supplier){
                case '兴强':
                    return yield parseInventory.XQ(options,query);
            }
        }
        * valueParse(options,query){
            const parseValue = this.ctx.service.parseValue;
            var $1 = parseValue.parseToLine(options);
            var $2 = parseValue.removeUnuseTable($1);
            var $3 = parseValue.mixinLand($2);
            var $4 = parseValue.separateData($3);
            var $5 = parseValue.mergeData($4);

            const result = yield this.ctx.service.transaction.valueImport($5,query);//把最终数据交给数据库事务处理

            return $5
        }
    }
    return Excel;
}