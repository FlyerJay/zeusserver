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
            const fileName = extendsNameArr[0];
            if(extendsName.indexOf('xls') < 0) return {
                code:-1,
                msg:'文件后缀必须是xls或xlsx'
            }
            let fileInfo = {};
            let params = fileName.split('_');
            if(params.length < 3) return {
                code:-1,
                msg:"请按照格式书写文件名"
            }
            fileInfo.supplier = params[0];
            fileInfo.material = params[1];
            fileInfo.time = params[2];
            params[3] ? fileInfo.temp = params[3] : "";
            params[4] ? fileInfo.delete = params[4] : "";
            fileInfo.fileName = fileName;
            fileInfo.userId = query.userId;
            fileInfo.comId = query.comId;
            if(fileInfo.time.length != 8){
                return {
                    code:-1,
                    msg:"文件的时间不正确"
                }
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
                        if(resout.content){
                            result.push(resout);
                        }
                    }
                });
                res(result);
            });
            if(fileInfo.temp && query && query.type == 'inventory' && fileInfo.temp == '库存表') {
                fileInfo.delete == "覆盖" ? fileInfo.delete = true : fileInfo.delete = false;
                return yield this.tempInventory(result,fileInfo);
            }
            return query && query.type == 'inventory' ? yield this.inventoryParse(result,fileInfo) : yield this.valueParse(result,fileInfo);
        }
        * inventoryParse(options,query){
            const parseValue = this.ctx.service.parseValue;
            var $1 = parseValue.parseToLine(options);
            var result = $1;
            return yield this.inventoryDispatch(result,query);
        }
        * tempInventory(options,query){
            const parseValue = this.ctx.service.parseValue;
            var $1 = parseValue.parseToLine(options);
            const youfa = this.ctx.service.youfa;
            var result = {};
            result = yield youfa.TEMP($1,query);
            const data = yield this.ctx.service.transaction.inventoryTempImport(result,query);//把最终数据交给数据库事务处理
            return data;
        }
        * inventoryDispatch(options,query){
            const parseInventory = this.ctx.service.parseInventory;
            const youfa = this.ctx.service.youfa;
            var result = {};
            if(query.supplier.indexOf("源泰") > -1){
                result = yield parseInventory.WZ(options,query);
            }else if(query.supplier.indexOf("天一") > -1){
                result = yield youfa.TY(options,query);
            }else if(query.supplier.indexOf("兴强") > -1){
                result = yield youfa.XQ(options,query);
            }else if(query.supplier.indexOf("邯郸友发") > -1){
                result = yield youfa.YF(options,query);
            }else if(query.supplier.indexOf("连创") > -1){
                result = yield youfa.LC(options,query);
            }else if(query.supplier.indexOf("友发德众") > -1){
                result = yield youfa.DZ(options,query);
            }else if(query.supplier.indexOf("邯郸正大") > -1){
                result = yield youfa.ZD(options,query);
            }else if(query.supplier.indexOf("利顺信达") > -1){
                result = yield youfa.XD(options,query);
            }else if(query.supplier.indexOf("拓源") > -1){
                result = yield youfa.XTY(options,query);
            }else if(query.supplier.indexOf("德天") > -1){
                result = yield youfa.DT(options,query);
            }else if(query.supplier.indexOf("中通") > -1){
                result = yield youfa.ZT(options,query);
            }else if(query.supplier.indexOf("津瑜") > -1){
                result = yield youfa.JY(options,query);
            }else if(query.supplier.indexOf("荣祥") > -1){
                result = yield youfa.RX(options,query);
            }
            result = parseInventory.mergeInventory(result);
            result = parseInventory.removeRepeatData(result);
            return result;
            // const data = yield this.ctx.service.transaction.inventoryImport(result,query);//把最终数据交给数据库事务处理
            // return data;
        }
        * valueParse(options,query){
            const parseValue = this.ctx.service.parseValue;
            options.length = 1;
            var $1 = parseValue.parseToLine(options);
            var $2 = parseValue.removeUnuseTable($1);
            var $3 = parseValue.mixinLand($2);
            var $4 = parseValue.separateData($3);
            var $5 = parseValue.mergeData($4);
            var data = {
                code:200,
                msg:"正在解析中，请耐心等待"
            }

            const result = yield this.ctx.service.transaction.valueImport($5,query);//把最终数据交给数据库事务处理

            return data
        }
    }
    return Excel;
}