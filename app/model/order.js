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
            type:STRING,
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
                const $1 = yield app.model.query(``)
            },
            * addOrder(options){
                if(!options.userId) return {
                    code:-1,
                    msg:"缺少用户信息"
                }
                if(!options.comId) return {
                    code:-1,
                    msg:"缺少公司信息"
                }
                if(!options.supplierInventoryIds) return {
                    code:-1,
                    msg:"缺少货物信息"
                }
                const now = new Date();
                const year = now.getFullYear();
                const mouth = now.getMonth() + 1;
                const date = now.getDate();
                const hour = now.getHours();
                const min = now.getMinutes();
                const sec = now.getSeconds();
                let random = Math.floor(Math.random() * 10000)+'';
                if(random.length<4){
                    for(var i=0;i<=4-random.length;i++){
                        random = '0'+random;
                    }
                }
                let orderNo = `${year}${mouth}${date}${hour}${min}${sec}${options.comId}${random}`
                const result = yield this.create(Object.assign(options,{validate:0,createTime:new Date().getTime(),orderNo}));
                return {
                    code:200,
                    msg:"下单成功",
                    data:result
                }
            },
            * orderDetail(options){

            },
            * removeOrder(options){
                if(!options.orderNo) return {
                    code:-1,
                    msg:"请填写要删除的订单编号"
                }
                const result = yield this.destroy({
                    where:{
                        orderNo:{
                            $in:options.supplierId.split(','),
                        }
                    }
                })
            }
        }
    })
}