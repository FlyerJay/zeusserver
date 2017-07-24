'use strict';
const xlsx = require('node-xlsx');

module.exports = app => {
    class Export extends app.Service {
        * order(options) {
            const result = yield app.model.query(`SELECT o.orderNo,o.orderPrice,o.orderWeight,o.orderAdjust,ui.userId,ui.userName,o.createTime,o.validate,
                (select count(distinct supplierId) from order_detail where orderNo = o.orderNo) as supplierCount,
                (select s.supplierName from order_detail od left join supplier s on s.supplierId = od.supplierId where od.orderNo = o.orderNo limit 0,1) as supplierName
                FROM tb_order o
                LEFT JOIN user_info ui
                ON ui.userId = o.userId
                WHERE o.comId = :comId
                AND o.userId = :userId
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
                })
            var tmpData = [];
            const orderStatus = {
                '0':'未审核',
                '1':'已审核'
            }
            tmpData.push(['订单编号','下单时间','供应商','总吨位','总价格','下浮总额','下单人','状态']);
            result[0].map((v)=>{
                const createTime = new Date(v['createTime']).toLocaleString();
                const orderNo = v['orderNo'];
                const orderPrice = v['orderPrice'];
                const orderWeight = v['orderWeight'];
                const orderAdjust = v['orderAdjust'];
                const userId = v['userId'];
                const validate = orderStatus[v['validate']];
                var supplierName = v['supplierName'].replace(/黑管|热镀锌|镀锌带/g,'');
                var lineData = [orderNo,createTime,supplierName,orderWeight,orderPrice,orderAdjust,userId,validate];
                tmpData.push(lineData);
            })
            var buffer = xlsx.build([{name: "订单列表", data: tmpData}])
            return buffer;
        }
        * orderDetail(options) {
            const list = yield app.model.query(`select od.*,s.supplierName from order_detail od 
                left join supplier s
                on s.supplierId = od.supplierId
                where od.orderNo = :orderNo`,{
                replacements:{
                    orderNo:options.orderNo,
                }
            })
            var tmpData = [];
            tmpData.push(['规格','类型','供应商','数量','单价','重量','下浮','备注']);
            list[0].map((v)=>{
                const spec = v['spec'];
                const type = v['type'];
                const supplierName = v['supplierName'];
                const orderAmount = v['orderAmount'];
                const unitPrice = v['unitPrice'];
                const Weight = v['Weight'];
                const orderDcrease = v['orderDcrease'];
                const comment = v['comment'];
                var lineData = [spec,type,supplierName,orderAmount,unitPrice,Weight,orderDcrease,comment];
                tmpData.push(lineData);
            })
            var buffer = xlsx.build([{name: "订单列表", data: tmpData}])
            return buffer;
        }
        * orderPrint(options) {
            const [$1,$2] = yield [app.model.query(`SELECT o.* FROM tb_order o WHERE o.orderNo = :orderNo`,{
                replacements:{
                    orderNo:options.orderNo,
                }
            }),
            app.model.query(`select od.*,s.supplierName from order_detail od 
                left join supplier s
                on s.supplierId = od.supplierId
                where od.orderNo = :orderNo`,{
                    replacements:{
                        orderNo:options.orderNo,
                    }
                })
            ]

            return {
                code:200,
                data:{
                    order:$1[0][0],
                    orderDetail:$2[0],
                },
                msg:"查询成功"
            }
        }
    }
    return Export;
}