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
            * list(options) {
                return this.findAll();
            }
        }
    })
}