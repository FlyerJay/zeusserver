/**
 * author:flyerjay
 * 2017-04-20
 * 供应商库存实体类
 */
'use strict';

module.exports = app => {
    const { STRING, INTEGER } = app.Sequelize;

    return app.model.define('SupplierInventory',{
        supplierInventoryId: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull:false,
            comment:"库存表主键",
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
            allowNull:false,
            comment:"类别"
        },
        material: {
            type:STRING,
            comment:"材质"
        },
        inventoryAmount: {
            type:INTEGER,
            comment:"库存数量"
        },
        perAmount: {
            type:INTEGER,
            comment:"单件支数"
        },
        inventoryWeight: {
            type:STRING,
            comment:"库存重量"
        }
    },{
        freezeTabName:true,
        underscored:true,
		tableName:"supplier_inventory",
		timestamps:false,
        classMethods:{
            associate(){
                app.model.SupplierInventory.belongsTo(app.model.Supplier,{foreignKey:'supplierId',targetKey:'supplierId'});
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
                    ]
                });
                if(result.length === 0) return {
                    code:-1,
                    msg:"数据为空"
                }
                return {
                    result
                };
            },
            * addInventory(options) {
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
            * updateInventory(options) {
                if(!options.supplierId) return {
                    code: -1,
                    msg: '缺少必要参数'
                }
                const result = yield this.update(options,{
                    where :{
                        supplierInventoryId:{
                            $eq:options.supplierInventoryId,
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
            * deleteInventory(options) {
                if(!options.supplierId) return {
                    code: -1,
                    msg: '缺少必要参数'
                }
                const result = yield this.destroy({
                    where :{
                        supplierInventoryId:{
                            $eq:options.supplierInventoryId,
                        }
                    }
                })

                if(!result) return {
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
            }
        }
    })
}