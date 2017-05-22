/**
 * author:flyerjay
 * 2017-05-22
 * 订单从表实体类
 */
'use strict';

module.exports = app => {
    const { STRING, INTEGER} = app.Sequelize;

    return app.model.define('OrderDetail',{
        orderNo: {
            type: STRING,
            primaryKey: true,
            allowNull:false,
            comment:"定制需求主键"
        },
        supplierInventoryId: {
            type: STRING,
            comment:"库存主键"
        },
        orderAmount: {
            type: STRING,
            allowNull:false,
            comment:"定制数量"
        },
        unitPrice: {
            type:STRING,
            allowNull:false,
            comment:"单价",
        },
        orderDcrease: {
            type: STRING,
            comment:"订单下浮"
        },
    },{
        freezeTabName:true,
        underscored:true,
		tableName:"order_detail",
		timestamps:false,
    })
}