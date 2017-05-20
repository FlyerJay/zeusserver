'use strict';
/**
 * 数据库事务处理，主要是表导入事务
 */
var utils = require('../utils');

module.exports = app => {
    class TransAction extends app.Service {
        * valueImport(options,query) {
            var time = String(new Date().getFullYear())+String((new Date().getMonth()+1)<10?'0'+(new Date().getMonth()+1):(new Date().getMonth()+1))+String(new Date().getDate()<10?'0'+new Date().getDate():new Date().getDate());
            app.model.transaction((t)=>{
                return app.model.SupplierValue.destroy({
                    where:{
                        comId:{
                            $eq:query.comId?query.comId:'01'
                        }
                    },
                    transaction:t,
                }).then(()=>{
                    return app.model.Supplier.findAll({
                        where:{
                            supplierName:{
                                $in:options.head
                            }
                        },
                        attributes:['supplierId','supplierName'],
                        transaction:t,
                    })
                }).then((data)=>{
                    let supplierIndex = {};
                    for(var j=0;j<data.length;j++){
                        supplierIndex[data[j].dataValues.supplierName] = data[j].dataValues.supplierId;
                    }
                    let line = options.line;
                    return Promise.all(line.map((v) => {
                        if(supplierIndex[v[2]]){
                            app.model.SupplierValue.create({
                                supplierId:supplierIndex[v[2]],
                                comId:'01',
                                spec:v[0],
                                type:v[1],
                                value:v[3],
                                material:v[4],
                                lastUpdateTime:time,
                            },{transaction:t})
                        }
                    }))
                })
            }).then((res)=>{
                console.log('事务执行完毕');
            }).catch((err)=>{
                console.log(err);
            })
        }
        * inventoryImport(options,info){
            const time = info.time;
            var supplierId = 0;
            for(var i = 0;i < options.length;i++){
                options[i].line.map((v)=>{
                    let specArr = v[0].split('*');
                    if(specArr[0] == specArr[1]){
                        v.push('方管')
                    }else{
                        v.push("矩管")
                    }
                })
            }
            app.model.transaction((t)=>{
                return app.model.Supplier.findOne({
                    where:{
                        supplierName:{
                            $eq:info.supplier
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
                            lastUpdateTime:{
                                $eq:time,
                            }
                        },
                        transaction:t
                    })
                }).then((data)=>{
                    let line = options.line;
                    return Promise.all(line.map((v) => {
                        if(supplierId != 0 ){
                            app.model.SupplierInventory.create({
                                supplierId:supplierId,
                                comId:'01',
                                spec:v[0],
                                type:v[4],
                                long:v[1],
                                material:info.material,
                                inventoryAmount:v[2],
                                perAmount:v[3],
                                lastUpdateTime:time,
                            },{transaction:t})
                        }else{
                            res({code:-1,msg:"供应商不存在的"});
                        }
                    }))
                })

            }).then((res)=>{
                console.log("事务执行完毕");
            }).catch((err)=>{
                console.log(err);
            })
        }
    }
    return TransAction;
}