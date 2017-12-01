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
        long:{
            type:INTEGER,
            comment:"长度"
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
        daPrice: {
            type: DOUBLE(10,2),
            allowNull: true,
            comment: "到岸单价"
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
        },
        minPrice: {
            type:INTEGER,
            comment:"最低价格"
        },
        minSupplier:{
            type:STRING(20),
            comment:"供应商名字",
        },
        minInventory:{
            type:INTEGER,
            comment:"最小库存",
        }
    },{
        freezeTabName:true,
        underscored:true,
		tableName:"order_detail",
        timestamps:false,
        classMethods: {
            * updateDetail(options) {
                if(!options.orderNo) return {
                    code: -1,
                    msg: "缺少订单编号"
                }
                if(!options.orderDetailId) return {
                    code: -1,
                    msg: "缺少订单详情编号"
                }
                const $1 = yield this.findOne({where:{
                    orderDetailId: {
                        $eq: options.orderDetailId
                    }
                }})
                
                const $2 = yield app.model.Order.findOne({
                    where: {
                        orderNo: {
                            $eq: options.orderNo
                        }
                    }
                })
                var oldDetail = $1.dataValues;
                var oldData = $2.dataValues;
                app.model.Order.update({
                    orderPrice: oldData.orderPrice - (oldDetail.unitPrice * oldDetail.Weight + oldDetail.orderDcrease) + options.unitPrice * options.Weight + options.orderDcrease,
                    orderAdjust: (oldData.orderAdjust - 0) + (options.orderDcrease - 0) - (oldDetail.orderDcrease-0),
                    orderWeight: oldData.orderWeight + options.Weight - oldDetail.Weight
                },{where:{
                    orderNo: {
                        $eq: options.orderNo
                    }
                }})
                yield this.update(options,{
                    where: {
                        orderDetailId: {
                            $eq: options.orderDetailId
                        }
                    }
                })
                
                return {
                    code: 200,
                    msg: "操作成功"
                }
            }
        }
    })
}