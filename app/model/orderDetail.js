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
            type: STRING(50),
            primaryKey: true,
            allowNull:false,
            comment:"定制需求主键"
        },
        supplierInventoryId: {
            type: INTEGER,
            comment:"库存主键"
        },
        orderAmount: {
            type: INTEGER,
            allowNull:false,
            comment:"定制数量"
        },
        unitPrice: {
            type:STRING(10),
            allowNull:false,
            comment:"单价",
        },
        orderDcrease: {
            type: STRING(10),
            comment:"订单下浮"
        },
    },{
        freezeTabName:true,
        underscored:true,
		tableName:"order_detail",
		timestamps:false,
    })
}