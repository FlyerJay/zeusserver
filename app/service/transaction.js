'use strict';
/**
 * 数据库事务处理，主要是表导入事务
 */
var utils = require('../utils');

module.exports = app => {
    class TransAction extends app.Service {
        * valueImport(options,query) {
            var indexs = {};
            return app.model.transaction((t)=>{
                return app.model.Supplier.findAll({
                    where:{
                        supplierName:{
                            $in:options.head
                        },
                        isDelete:{
                            $eq:'N',
                        }
                    },
                    attributes:['supplierId','supplierName'],
                    transaction:t,
                }).then((data)=>{
                    let supplierIndex = {};
                    let supplierIds = [];
                    for(var j=0;j<data.length;j++){
                        supplierIndex[data[j].dataValues.supplierName] = data[j].dataValues.supplierId;
                        supplierIds.push(data[j].dataValues.supplierId);
                    }
                    indexs = supplierIndex;
                    return app.model.SupplierValue.destroy({
                        where:{
                            lastUpdateTime:{
                                $eq:query.time
                            },
                            supplierId:{
                                $in:supplierIds
                            },
                            type:{
                                $eq:query.material
                            }
                        },
                        transaction:t,
                    }).then(()=>{
                        let line = options.line;
                        return Promise.all(line.map((v) => {
                            const specArr = v[0].split('*');
                            if(v[0].length > 16 || specArr.length != 3 || isNaN(specArr[0]) || isNaN(specArr[1]) || isNaN(specArr[2])){
                                console.log(specArr);
                            }else{
                                if(indexs[v[2]]){
                                    app.model.SupplierValue.create({
                                        supplierId:indexs[v[2]],
                                        spec:v[0],
                                        type:query.material,
                                        value:v[3],
                                        material:v[1],
                                        lastUpdateTime:query.time,
                                    },{transaction:t})
                                }
                            }
                        }))
                    })
                }).then(() => {
                    return app.model.OperateRecord.create({
                        userId:query.userId,
                        comId:query.comId,
                        type:'上传价格表',
                        detail:`${query.fileName}`,
                        createTime:+new Date()
                    },{transaction:t})
                })
            }).then((res)=>{
                return {
                    code:200,
                    msg:"解析完成"
                }
            }).catch((err)=>{
                return {
                    code:-1,
                    msg:"解析失败"
                }
            })
        }
        * inventoryImport(options,info){
            const time = info.time;
            var supplierId = 0;
            let line = options.line
            let newLine = [];
            line.map((v)=>{
                let specArr = v[0].split('*');
                if(specArr[0] == specArr[1]){
                    v.push('方管')
                }else{
                    v.push("矩管")
                }
                newLine.push(v);
            })
            options.line = newLine;
            return app.model.transaction((t)=>{
                return app.model.Supplier.findOne({
                    where:{
                        supplierName:{
                            $eq:info.supplier
                        },
                        isDelete:{
                            $eq:'N',
                        }
                    },
                    attributes:['supplierId','supplierName'],
                    transaction:t
                }).then((data)=>{
                    if(data){
                        supplierId = data.dataValues.supplierId;
                    }
                    return app.model.SupplierInventory.destroy({
                        where:{
                            supplierId:{
                                $eq:supplierId,
                            },
                            type:{
                                $eq:info.material
                            }
                        },
                        transaction:t
                    })
                }).then((data)=>{
                    let line = options.line;
                    var memerry = {};
                    return Promise.all(line.map((v) => {
                        const specArr = v[0].split('*');
                        if(v[0].length > 16 || specArr.length != 3 || isNaN(specArr[0]) || isNaN(specArr[1]) || isNaN(specArr[2])){
                            console.log(specArr);
                        }else{
                            if(supplierId != 0 ){
                                app.model.SupplierInventory.create({
                                    supplierId:supplierId,
                                    spec:v[0],
                                    type:info.material,
                                    long:v[1],
                                    material:v[4],
                                    inventoryAmount:v[2] ? v[2] : '0',
                                    perAmount:v[3] ? v[3] : '100',
                                    lastUpdateTime:time,
                                },{transaction:t})
                            }else{
                                res({code:-1,msg:"供应商不存在的"});
                            }
                        }
                    }))
                }).then(() => {
                    return app.model.OperateRecord.create({
                        userId:info.userId,
                        comId:info.comId,
                        type:'上传库存表',
                        detail:`${info.fileName}`,
                        createTime:+new Date()
                    },{transaction:t})
                })
            }).then((res)=>{
                return {
                    code:200,
                    msg:"解析完成"
                }
            }).catch((err)=>{
                return {
                    code:-1,
                    msg:"解析失败",
                    err:err
                }
            })
        }
        * inventoryTempImport(options,info){
            const time = info.time;
            var supplierId = 0;
            let line = options.line
            let newLine = [];
            line.map((v)=>{
                let specArr = v[0].split('*');
                if(specArr[0] == specArr[1]){
                    v.push('方管')
                }else{
                    v.push("矩管")
                }
                newLine.push(v);
            })
            options.line = newLine;
            return app.model.transaction((t)=>{
                return app.model.Supplier.findOne({
                    where:{
                        supplierName:{
                            $eq:info.supplier
                        },
                        isDelete:{
                            $eq:'N',
                        }
                    },
                    attributes:['supplierId','supplierName'],
                    transaction:t
                }).then((data)=>{
                    if(data){
                        supplierId = data.dataValues.supplierId;
                    }
                    return app.model.SupplierInventory.destroy({
                        where:{
                            supplierId:{
                                $eq:supplierId,
                            },
                            type:{
                                $eq:info.material
                            }
                        },
                        transaction:t
                    })
                }).then(()=>{
                    let line = options.line;
                    var memerry = {};
                    return Promise.all(line.map((v) => {
                        const specArr = v[0].split('*');
                        if(v[0].length > 16 || specArr.length != 3 || isNaN(specArr[0]) || isNaN(specArr[1]) || isNaN(specArr[2])){
                            console.log(specArr);
                        }else{
                            if(supplierId != 0 ){
                                app.model.SupplierInventory.create({
                                    supplierId:supplierId,
                                    spec:v[0],
                                    type:info.material,
                                    long:v[1],
                                    material:v[4],
                                    inventoryAmount:v[2],
                                    perAmount:v[3],
                                    lastUpdateTime:time,
                                },{transaction:t})
                            }else{
                                res({code:-1,msg:"供应商不存在的"});
                            }
                        }
                    }))
                }).then(()=>{
                    return app.model.OperateRecord.create({
                        userId:info.userId,
                        comId:info.comId,
                        type:'补充临时库存表',
                        detail:`${info.fileName}`,
                        createTime:+new Date()
                    },{transaction:t})
                })
            }).then((res)=>{
                return {
                    code:200,
                    msg:"补充临时表成功"
                }
            }).catch((err)=>{
                return {
                    code:-1,
                    msg:"解析失败"
                }
            })
        }
    }
    return TransAction;
}