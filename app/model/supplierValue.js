/**
 * author:flyerjay
 * 2017-04-20
 * 供应商价格实体类
 */
'use strict';

module.exports = app => {
    const { STRING, INTEGER } = app.Sequelize;

    return app.model.define('SupplierValue',{
        supplierValuerId: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull:false,
            comment:"价格表主键",
        },
        supplierId: {
            type: INTEGER,
            allowNull:false,
            comment:"供应商编号",
        },
        spec: {
            type: STRING,
            allowNull:false,
            comment:"规格"
        },
        lastUpdateTime: {
            type:STRING,
            allowNull:false,
            comment:"最近更新时间"
        },
        type: {
            type:STRING,
            comment:"类别"
        },
        value: {
            type:STRING,
            comment:"出厂价"
        },
        material: {
            type:STRING,
            comment:"材质"
        }
    },{
        freezeTabName:true,
        underscored:true,
		tableName:"supplier_value",
		timestamps:false,
        classMethods:{
            * getList(options){
                yield this.sync();
                const result = yield this.findAndCountAll({
                    limit:options.pageSize - 0 || 30,
                    offset:(options.page - 0) * (options.pageSize - 0) || 0,
                    where:(function(){
                        var condition = {};
                        options.supplierName?condition.supplierName={
                            like:`%${options.supplierName}%`
                        }:'';
                        options.address?condition.address={
                            $eq:options.address
                        }:'';
                        return condition;
                    }())
                });
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
                var result = yield this.findOne({
                    where:{
                        supplierId:{
                            $eq:options.supplierId,
                        }
                    }
                })
                if(!result) return{
                    code:-1,
                    msg:'修改的记录不存在'
                }
                for(var props in options){
                    result[props]?result[props] = options[props]:'';
                }
                result.save();
                return {
                    code:200,
                    msg:"修改成功"
                }
            },
            * add(options){
                yield this.sync();
                return yield this.create(options);
            },
            * remove(options){
                const result = yield this.destroy({
                    where:{
                        supplierId:{
                            $in:options.supplierId.split(','),
                        }
                    }
                })
                if(result) return {
                    code:200,
                    msg:'删除成功'
                }
                return {
                    code:-1,
                    msg:'删除失败'
                };
            }
        }
    })
}