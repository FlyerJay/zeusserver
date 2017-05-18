'use strict';
/**
 * 数据库事务处理，主要是表导入事务
 */

module.exports = app => {
    class TransAction extends app.Service {
        * valueImport(options,query) {
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
                    for(var j=0;j<data.length;j++){
                        console.log(data[j].dataValues);
                    }
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