'use strict';
/**
 * 数据库事务处理，主要是表导入事务
 */

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
    }
    return TransAction;
}