/**
 * author:flyerjay
 * 2017-04-19
 * 供应商实体类
 */
/**
 * author:flyerjay
 * 2017-04-19
 * 公司实体类
 */
'use strict';

module.exports = app => {
    const { STRING, INTEGER } = app.Sequelize;

    return app.model.define('Supplier',{
        supplierId: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull:false,
            comment:"供应商编号",
        },
        supplierName: {
            type: STRING,
            allowNull:false,
            comment:"供应商名称"
        },
        address: {
            type:STRING,
            allowNull:false,
            comment:"供应商地址"
        },
        freight: {
            type:STRING,
            comment:"运费"
        },
    },{
        freezeTabName:true,
		tableName:"supplier",
		timestamps:false,
        classMethods:{
            * getList(){
                yield this.sync();
                const result = yield this.findAll();
                if(result.length === 0) return {
                    code:-1,
                    msg:"数据为空"
                }
                return {
                    code:200,
                    msg:"查询成功",
                    data:result,
                }
            },
            * update(options){
                yield this.sync();
                return yield this.update(options,{
                    where:{
                        supplierId:{
                            $eq:options.supplierId,
                        }
                    }
                })
            },
            * add(options){
                yield this.sync();
                return yield this.create(options);
            }
        }
    })
}