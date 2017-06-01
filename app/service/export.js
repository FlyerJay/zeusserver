'use strict';
const xlsx = require('node-xlsx');

module.exports = app => {
    class Export extends app.Service {
        * order(options) {
            const result = yield app.model.query(`SELECT o.orderNo,o.orderPrice,o.orderWeight,o.orderAdjust,ui.userId,ui.userName,o.createTime,o.validate,
                (select count(distinct supplierId) from order_detail where orderNo = o.orderNo) as supplierCount
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
                        start:!options.page?0:(options.page - 1)*(options.pageSize?options.pageSize:30),
                        offset:options.pageSize?options.pageSize:30,
                    }
                })
            var tmpData = [];
            const orderStatus = {
                '0':'未审核',
                '1':'已审核'
            }
            tmpData.push(['订单编号','下单时间','供应商数量','总吨位','总价格','下浮总额','下单人','状态']);
            result[0].map((v)=>{
                const createTime = new Date(v['createTime']).toLocaleString();
                const orderNo = v['orderNo'];
                const orderPrice = v['orderPrice'];
                const orderWeight = v['orderWeight'];
                const orderAdjust = v['orderAdjust'];
                const userId = v['userId'];
                const validate = orderStatus[v['validate']];
                const supplierCount = v['supplierCount'];
                var lineData = [orderNo,createTime,supplierCount,orderWeight,orderPrice,orderAdjust,userId,validate];
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
            tmpData.push(['规格','类型','供应商','数量','单价','重量','下浮']);
            list[0].map((v)=>{
                const spec = v['spec'];
                const type = v['type'];
                const supplierName = v['supplierName'];
                const orderAmount = v['orderAmount'];
                const unitPrice = v['unitPrice'];
                const Weight = v['Weight'];
                const orderDcrease = v['orderDcrease'];
                var lineData = [spec,type,supplierName,orderAmount,unitPrice,Weight,orderDcrease];
                tmpData.push(lineData);
            })
            var buffer = xlsx.build([{name: "订单列表", data: tmpData}])
            return buffer;
        }
    }
    return Export;
}