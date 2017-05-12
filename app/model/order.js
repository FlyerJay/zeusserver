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
		tableName:"tb_order",
		timestamps:false,
        classMethods:{
            * orderList(options){
                if(!options.comId) return {
                    code:-1,
                    msg:"请输入公司编号"
                }
                var userCondition = ''
                if(options.userId) {
                    userCondition = 'AND o.userId = :userId'
                }
                const [$1,$2] = yield [app.model.query(`SELECT o.orderNo,o.orderPrice,ui.userName,o.createTime,o.validate FROM tb_order o
                LEFT JOIN user_info ui
                ON ui.userId = o.userId
                WHERE o.comId = :comId
                ${userCondition}
                ORDER BY o.createTime ASC
                LIMIT :start,:offset
                `,{
                    replacements:{
                        comId:options.comId,
                        userId:options.userId?options.userId:'',
                        start:!options.page?0:options.page*(options.pageSize?options.pageSize:30),
                        offset:!options.page?(options.pageSize?(options.pageSize-0):30):(((options.page-0)+1)*(options.pageSize?options.pageSize:30)),
                    }
                }),
                app.model.query(`SELECT count(1) AS count FROM tb_order o
                LEFT JOIN user_info ui
                ON ui.userId = o.userId
                WHERE o.comId = :comId
                ${userCondition}
                ORDER BY o.createTime ASC
                LIMIT :start,:offset
                `,{
                    replacements:{
                        comId:options.comId,
                        userId:options.userId?options.userId:'',
                        start:!options.page?0:options.page*(options.pageSize?options.pageSize:30),
                        offset:!options.page?(options.pageSize?(options.pageSize-0):30):(((options.page-0)+1)*(options.pageSize?options.pageSize:30)),
                    }
                })]
                var result = {}
                if(!$1[0] || $1[0].length <= 0) return {
                    code:-1,
                    msg:'查询数据为空',
                    data:[]
                }
                result.row = $1[0];
                result.totalCount = $2[0][0].count;
                result.page = options.page?options.page:0;
                result.pageSize = options.pageSize?options.pageSize:30;
                return {
                    code: 200,
                    data: result,
                    msg:'查询数据成功'
                }
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
                var  mouth = now.getMonth() + 1;
                mouth = mouth < 10 ? '0'+mouth:mouth;
                var date = now.getDate();
                date = date < 10 ? '0' + date:date;
                var hour = now.getHours();
                hour = hour < 10 ? '0' + hour:hour;
                var min = now.getMinutes();
                min = min < 10 ? '0' + min:min;
                var sec = now.getSeconds();
                sec = sec < 10 ? '0' + sec:sec;
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
                if(!options.orderNo) return {
                    code:-1,
                    msg:"缺少订单编号,orderNo"
                }
                const $1 = yield app.model.query(`SELECT o.orderNo,o.comId,o.userId,o.supplierInventoryIds FROM tb_order o
                WHERE o.orderNo = :orderNo`,{
                    replacements:{
                        orderNo:options.orderNo
                    }
                })
                if(!$1[0] || $1[0].length === 0) return {
                    code:-1,
                    msg:"系统中不存在的订单号",
                }
                var list = [];
                console.log($1[0][0].supplierInventoryIds);
                var goods = $1[0][0].supplierInventoryIds.split(',')
                console.log(goods);
                for(var i = 0;i<goods.length;i++){
                    var key = goods[i].split(':')[0];
                    var amount = goods[i].split(':')[1];
                    list[i] = yield app.model.query(`SELECT si.spec,si.type,si.material,:amount as amount,si.inventoryAmount,si.perAmount,s.supplierName FROM supplier_inventory si
                    LEFT JOIN supplier s
                    ON s.supplierId = si.supplierId
                    WHERE si.supplierInventoryId = :key`,{
                        replacements:{
                            amount:amount?amount:1,
                            key:key
                        }
                    })
                }
                return {
                    code:200,
                    msg:"查询订单成功",
                    data:$1[0],
                    list:list
                }
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