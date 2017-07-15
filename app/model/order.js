/**
 * author:flyerjay
 * 2017-04-19
 * 订单实体类
 */
'use strict';

module.exports = app => {
    const { STRING , INTEGER, DOUBLE, BIGINT } = app.Sequelize;

    return app.model.define('Order',{
        orderNo: {
            type:STRING(50),
            primaryKey: true,
            allowNull:false,
            comment:"订单编号"
        },
        comId: {
            type: STRING(2),
            allowNull:false,
            comment:"公司编号",
        },
        userId: {
            type: STRING(20),
            allowNull:false,
            comment:"公司名称"
        },
        orderPrice: {
            type: DOUBLE(10,2),
            comment: "订单价格",
        },
        orderWeight:{
            type:DOUBLE(10,2),
            comment:"订单总吨位"
        },
        orderAdjust:{
            type:DOUBLE(10,2),
            comment:"下浮总额"
        },
        validate:{
            type:INTEGER,
            allowNull:false,
            comment:"是否审核通过"
        },
        createTime:{
            type:BIGINT(20),
            allowNull:false,
            comment:"创建时间"
        },
        comment:{
            type:STRING(100),
            comment:"备注",
        }
    },{
        freezeTabName:true,
        underscored:true,
		tableName:"tb_order",
		timestamps:false,
        classMethods:{
            * verifyList(options) {
                if(!options.comId) return {
                    code:-1,
                    msg:"请输入公司编号"
                }
                const [$1,$2] = yield [app.model.query(`SELECT o.orderNo,o.orderPrice,o.orderWeight,o.orderAdjust,ui.userId,ui.userName,o.createTime,o.validate,
                (select count(distinct supplierId) from order_detail where orderNo = o.orderNo) as supplierCount
                FROM tb_order o
                LEFT JOIN user_info ui
                ON ui.userId = o.userId
                WHERE o.comId = :comId
                AND orderNo LIKE :orderNo
                AND validate = 0
                ORDER BY o.createTime DESC
                LIMIT :start,:offset
                `,{
                    replacements:{
                        comId:options.comId,
                        orderNo:options.orderNo?`%${options.orderNo}%`:'%%',
                        start:!options.page?0:(options.page - 1)*(options.pageSize?options.pageSize:15),
                        offset:options.pageSize?options.pageSize:15,
                    }
                }),
                app.model.query(`SELECT count(1) AS count FROM tb_order o
                LEFT JOIN user_info ui
                ON ui.userId = o.userId
                WHERE o.comId = :comId
                AND orderNo LIKE :orderNo
                AND validate = 0
                ORDER BY o.createTime DESC
                `,{
                    replacements:{
                        comId:options.comId,
                        orderNo:options.orderNo?`%${options.orderNo}%`:'%%',
                        start:!options.page?0:(options.page - 1)*(options.pageSize?options.pageSize:15),
                        offset:options.pageSize?options.pageSize:15,
                    }
                })]
                var result = {}
                if(!$1[0] || $1[0].length <= 0) return {
                    code:200,
                    msg:'查询数据为空',
                    data:{
                        row:[],
                        count:0
                    }
                }
                result.row = $1[0];
                result.totalCount = $2[0][0].count;
                result.page = options.page?options.page:0;
                result.pageSize = options.pageSize?options.pageSize:15;
                return {
                    code: 200,
                    data: result,
                    msg:'查询数据成功'
                }
            },
            * orderList(options){
                if(!options.comId) return {
                    code:-1,
                    msg:"请输入公司编号"
                }
                if(!options.comId) return {
                    code:-1,
                    msg:"请输入用户信息"
                }
                const [$1,$2] = yield [app.model.query(`SELECT o.orderNo,o.orderPrice,o.orderWeight,o.orderAdjust,ui.userId,ui.userName,o.createTime,o.validate,
                (select count(distinct supplierId) from order_detail where orderNo = o.orderNo) as supplierCount,
                (select s.supplierName from order_detail od left join supplier s on s.supplierId = od.supplierId where od.orderNo = o.orderNo limit 0,1) as supplierName
                FROM tb_order o
                LEFT JOIN user_info ui
                ON ui.userId = o.userId
                WHERE o.comId = :comId
                AND orderNo LIKE :orderNo
                ORDER BY o.createTime DESC
                LIMIT :start,:offset
                `,{
                    replacements:{
                        comId:options.comId,
                        userId:options.userId?options.userId:'',
                        orderNo:options.orderNo?`%${options.orderNo}%`:'%%',
                        start:!options.page?0:(options.page - 1)*(options.pageSize?options.pageSize:15),
                        offset:options.pageSize?options.pageSize:15,
                    }
                }),
                app.model.query(`SELECT count(1) AS count FROM tb_order o
                LEFT JOIN user_info ui
                ON ui.userId = o.userId
                WHERE o.comId = :comId
                AND orderNo LIKE :orderNo
                ORDER BY o.createTime DESC
                `,{
                    replacements:{
                        comId:options.comId,
                        userId:options.userId?options.userId:'',
                        orderNo:options.orderNo?`%${options.orderNo}%`:'%%',
                        start:!options.page?0:(options.page - 1)*(options.pageSize?options.pageSize:15),
                        offset:options.pageSize?options.pageSize:15,
                    }
                })]
                var result = {}
                if(!$1[0] || $1[0].length <= 0) return {
                    code:200,
                    msg:'查询数据为空',
                    data:{
                        row:[],
                        count:0
                    }
                }
                result.row = $1[0];
                result.totalCount = $2[0][0].count;
                result.page = options.page?options.page:0;
                result.pageSize = options.pageSize?options.pageSize:15;
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
                if(!options.supplierInventoryIds) return  {
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
                var self = this;
                return app.model.transaction(async (t)=>{
                    return await self.create({
                        orderNo,
                        userId:options.userId,
                        comId:options.comId,
                        orderPrice:options.orderPrice?Number(options.orderPrice):0.00,
                        orderWeight:options.orderWeight?Number(options.orderWeight):0.00,
                        orderAdjust:options.orderAdjust?Number(options.orderAdjust):0.00,
                        validate:0,
                        createTime:+new Date()
                    },{transaction:t}).then((res)=>{
                        var orderDetail = options.supplierInventoryIds;
                        return Promise.all(orderDetail.map((v)=>{
                            app.model.OrderDetail.create({
                                orderNo,
                                spec: v.spec,
                                type:v.type,
                                supplierId:v.supplierId,
                                orderAmount:Number(v.chartAmount),
                                unitPrice:Number(v.purePrice),
                                Weight:Number(v.chartWeight),
                                orderDcrease:Number(v.totalAdjust),
                                comment: v.comment,
                            },{transaction:t})
                            app.model.Chart.destroy({
                                where:{
                                    chartId:{
                                        $eq:v.chartId
                                    }
                                },
                                transaction:t
                            })
                        }))
                    })
                }).then((res)=>{
                    return {
                        code:200,
                        msg:"下单成功"
                    }
                }).catch((err)=>{
                    return {
                        code:-1,
                        msg:"下单失败"
                    }
                })
            },
            * orderDetail(options){
                if(!options.orderNo) return {
                    code:-1,
                    msg:"缺少订单编号,orderNo"
                }
                const list = yield app.model.query(`select od.*,s.supplierName from order_detail od 
                    left join supplier s
                    on s.supplierId = od.supplierId
                    where od.orderNo = :orderNo`,{
                    replacements:{
                        orderNo:options.orderNo,
                    }
                })
                return {
                    code:200,
                    msg:"查询订单成功",
                    data:{
                        row:list[0],
                        count:list.length
                    },
                }
            },
            * removeOrder(options){
                if(!options.orderNo) return {
                    code:-1,
                    msg:"请填写要删除的订单编号"
                }
                const result = yield [this.destroy({
                    where:{
                        orderNo:{
                            $in:options.orderNo.split(','),
                        }
                    }
                }),
                app.model.OrderDetail.destroy({
                    where:{
                        orderNo:{
                            $in:options.orderNo.split(','),
                        }
                    }
                })]
                return {
                    code:200,
                    msg:"删除成功",
                }
            },
            * verify(options){
                if(!options.orderNo) return {
                    code:-1,
                    msg:"需要订单号才能审核"
                }
                if(!options.operator) return {
                    code:-1,
                    msg:"请填写审核人"
                }
                if(!options.comId) return {
                    code:-1,
                    msg:"请填写公司信息"
                }
                const res = yield this.findOne({
                    where:{
                        orderNo:{
                            $eq:options.orderNo,
                        }
                    }
                })
                if(!res) return {
                    code:-1,
                    msg:"订单不存在"
                }
                var self = this;
                return app.model.transaction((t)=>{
                    return self.update({validate:1},{
                        where:{
                            orderNo:{
                                $eq:options.orderNo,
                            }
                        }
                    }).then(async ()=>{
                        return await app.model.OperateRecord.create({
                            userId:options.operator,
                            comId:options.comId,
                            type:'审核订单',
                            detail:`审核通过了${options.orderNo}订单`,
                            createTime:+new Date()
                        },{transaction:t}).catch((err)=>{
                            console.log(err);
                        })
                    })
                }).then((res)=>{
                    return {
                        code:200,
                        msg:"订单审核成功",
                        data:res
                    }
                }).catch((err)=>{
                    return {
                        code:-1,
                        msg:"订单审核出错",
                        data:err
                    }
                })
            }
        }
    })
}