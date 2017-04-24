/**
 * author:flyerjay
 * 2017-04-20
 * 供应商价格实体类
 */
'use strict';

module.exports = app => {
    const { STRING, INTEGER } = app.Sequelize;

    return app.model.define('SupplierValue',{
        supplierValueId: {
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
            associate(){
                app.model.SupplierValue.belongsTo(app.model.Supplier,{foreignKey:'supplierId',targetKey:'supplierId'});
            },
            * getList(options) {
                const result = yield this.findAndCountAll({
                    limit:options.pageSize - 0 || 30,
                    offset:(options.page - 0) * (options.pageSize - 0) || 0,
                    include:[
                        {
                            model:app.model.Supplier,
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
                        }
                    ],
                    where:(function(){
                        var condition = {};
                        options.spec?condition.spec={
                            like:`%${options.spec}%`
                        }:'';
                        options.type?condition.type={
                            $eq:options.type
                        }:'';
                        return condition;
                    }())
                });
                if(result.length === 0) return {
                    code:-1,
                    msg:"数据为空"
                }
                return {
                    result
                };
            },
            * addValue(options) {
                if (!options.supplierId) return {
                    code: -1,
                    msg: '请选择供应商',
                }
                if(!options.spec) return {
                    code: -1,
                    msg: '规格不能为空'
                }
                if(!options.type) return {
                    code: -1,
                    msg: '货物类别不能为空'
                }
                return yield this.create(Object.assign(options,{lastUpdateTime:new Date().getTime()}));
            },
            * updateValue(options) {
                if(!options.supplierId) return {
                    code: -1,
                    msg: '缺少必要参数'
                }
                const result = yield this.update(options,{
                    where :{
                        supplierInventoryId:{
                            $eq:options.supplierValueId,
                        }
                    }
                })
                if(!result) return{
                    code: -1,
                    msg: '更新出错'
                }
                if(result == 0) return {
                    code: -1,
                    msg: '没有任何更新'
                }
                return {
                    code: 200,
                    msg: '更新数据成功'
                }
            },
            * deleteValue(options) {
                if(!options.supplierId) return {
                    code: -1,
                    msg: '缺少必要参数'
                }
                const result = yield this.destroy({
                    where :{
                        supplierInventoryId:{
                            $eq:options.supplierValueId,
                        }
                    }
                })

                if(!result) return {
                    code: -1,
                    msg: '删除错误'
                }
                if(result == 0) return {
                    code: -1,
                    msg: '受影响数据为0'
                }
                return {
                    code: 200,
                    msg: '删除数据成功'
                }
            }
        }
    })
}