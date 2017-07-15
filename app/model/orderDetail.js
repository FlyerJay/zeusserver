/**
 * author:flyerjay
 * 2017-05-22
 * 订单从表实体类
 */
'use strict';

module.exports = app => {
    const { STRING, INTEGER, DOUBLE} = app.Sequelize;

    return app.model.define('OrderDetail',{
        orderDetailId:{
            type:INTEGER,
            autoIncrement: true,
            primaryKey:true,
            allowNull:false,
            comment:"订单详情主键"
        },
        orderNo: {
            type: STRING(50),
            allowNull:false,
            comment:"订单编号"
        },
        spec:{
            type:STRING(20),
            allowNull:false,
            comment:"规格"
        },
        type:{
            type:STRING(10),
            allowNull:false,
            comment:"类型"
        },
        supplierId:{
            type:INTEGER,
            allowNull:false,
            comment:"供应商主键"
        },
        orderAmount: {
            type: INTEGER,
            allowNull:false,
            comment:"定制数量"
        },
        unitPrice: {
            type:DOUBLE(10,2),
            allowNull:false,
            comment:"单价",
        },
        Weight:{
            type:DOUBLE(10,2),
            comment:"总吨数"
        },
        orderDcrease: {
            type:DOUBLE(10,2),
            comment:"订单下浮"
        },
        comment: {
            type:STRING(100),
            comment:"备注"
        }
    },{
        freezeTabName:true,
        underscored:true,
		tableName:"order_detail",
		timestamps:false,
    })
}