/**
 * author:flyerjay
 * 2017-04-19
 * 订单实体类
 */
'use strict';

module.exports = app => {
    const { STRING , INTEGER } = app.Sequelize;

    return app.model.define('Order',{
        orderNo: {
            type:STRING,
            primaryKey: true,
            allowNull:false,
            comment:"订单编号"
        },
        comId: {
            type: STRING,
            allowNull:false,
            comment:"公司编号",
        },
        userId: {
            type: STRING,
            allowNull:false,
            comment:"公司名称"
        },
        orderPrice: {
            type: STRING,
            comment: "订单价格",
        },
        supplierInventoryIds:{
            type:STRING,
            allowNull:false,
            comment:"库存编号及数量"
        },
        validate:{
            type:INTEGER,
            allowNull:false,
            comment:"是否审核通过"
        },
        createTime:{
            type:INTEGER,
            allowNull:false,
            comment:"创建时间"
        }
    },{
        freezeTabName:true,
        underscored:true,
		tableName:"order",
		timestamps:false,
        classMethods:{
            * orderList(options){
                return yield this.findAll();
            },
            * addOrder(options){

            },
            * orderDetail(options){

            },
            * removeOrder(options){
                
            }
        }
    })
}