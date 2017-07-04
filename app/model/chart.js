/**
 * author:flyerjay
 * 2017-04-19
 * 购物车实体类
 */
'use strict';
var uuid = require('uuid');

module.exports = app => {
    const { STRING, INTEGER, DATE, UUID, BIGINT } = app.Sequelize;

    return app.model.define('Chart',{
        chartId: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull:false,
            comment:"购物车Id(主键无实际意义)",
        },
        userId: {
            type: STRING(20),
            allowNull:false,
            comment:"用户Id(主键)"
        },
        comId: {
            type: STRING(2),
            allowNull:false,
            comment:"公司编号(关联公司信息)"
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
        supplierId:{
            type:INTEGER,
            allNull:false,
            comment:"供应商主键"
        },
        type:{
            type:STRING(10),
            allNull:false,
            comment:"类型"
        },
        chartAmount: {
            type: INTEGER,
            comment: "采购数量"
        },
        chartAdjust: {
            type: INTEGER,
            comment: "采购价格调整（与商家报价的相对值）"
        },
        createTime: {
            type: BIGINT(20),
            comment:"记录创建时间"
        }
    },{
        freezeTabName:true,
        underscored:true,
		tableName:"chart",
		timestamps:false,
        classMethods:{
            * getList(options) {
                if(!options.userId) return {
                    code:-1,
                    msg:"缺少用户信息"
                }
                if(!options.comId) return {
                    code:-1,
                    msg:"缺少公司信息"
                }
                const result = {};
                const [$1,$2] = yield [app.model.query(`SELECT c.chartId,c.chartAmount,c.chartAdjust,si.spec,si.supplierId,si.long,si.type,si.perAmount,s.supplierName,c.supplierId,f.freight,s.benifit,sv.value FROM chart c
                LEFT JOIN supplier_inventory si ON
                si.supplierId = c.supplierId
                AND si.type = c.type
                AND si.spec = c.spec
                AND si.long = c.long
                LEFT JOIN (select *,sv.lastUpdateTime as time from (select * from supplier_value order by lastUpdateTime desc) sv group by supplierId,type,spec) sv ON
                si.spec = sv.spec AND
                si.type = sv.type AND
                si.material = sv.material
                AND si.supplierId = sv.supplierId
                AND si.comId = c.comId
                LEFT JOIN supplier s ON
                s.supplierId = si.supplierId
                AND s.comId = c.comId
                LEFT JOIN freight f ON
                f.address = s.address
                AND f.comId = c.comId
                WHERE c.userId = :userId AND
                c.comId = :comId
                ORDER BY s.supplierName DESC, c.createTime DESC
                LIMIT :start,:offset`,
                {
                    replacements:{
                        userId:options.userId?options.userId:'',
                        comId:options.comId?options.comId:'',
                        start:!options.page?0:(options.page - 1)*(options.pageSize?options.pageSize:30),
                        offset:options.pageSize?options.pageSize:30,
                    }
                }),
                app.model.query(`SELECT count(1) AS count FROM chart c
                LEFT JOIN supplier_inventory si ON
                si.supplierId = c.supplierId
                AND si.type = c.type
                AND si.spec = c.spec
                AND si.long = c.long
                LEFT JOIN (select *,sv.lastUpdateTime as time from (select * from supplier_value order by lastUpdateTime desc) sv group by supplierId,type,spec) sv ON
                si.spec = sv.spec AND
                si.type = sv.type 
                AND si.supplierId = sv.supplierId
                AND si.comId = c.comId
                LEFT JOIN supplier s ON
                s.supplierId = si.supplierId
                AND s.comId = c.comId
                AND s.isDelete = 'N'
                LEFT JOIN freight f ON
                f.address = s.address
                AND f.comId = c.comId
                WHERE c.userId = :userId AND
                c.comId = :comId
                ORDER BY c.createTime DESC`,
                {
                    replacements:{
                        userId:options.userId?options.userId:'',
                        comId:options.comId?options.comId:'',
                        start:!options.page?0:options.page*(options.pageSize?options.pageSize:30),
                        offset:!options.page?(options.pageSize?(options.pageSize-0):30):(((options.page-0)+1)*(options.pageSize?options.pageSize:30)),
                    }
                })]
                if(!$1[0] || $1[0].length === 0) return {
                    code:200,
                    msg:"数据为空",
                    data:{
                        conut:0,
                        row:[]
                    }
                }
                result.row = $1[0];
                result.totalCount = $2[0][0].count;
                result.page = options.page?options.page:0;
                result.pageSize = options.pageSize?options.pageSize:30;
                return {
                    code:200,
                    msg:"查询成功",
                    data:result,
                }
            },
            * add(options) {
                if(!options.userId) return {
                    code:-1,
                    msg:"需要用户信息"
                }
                if(!options.comId) return {
                    code:-1,
                    msg:"需要公司信息"
                }
                if(!options.supplierInventoryId) return {
                    code:-1,
                    msg:"缺少库存信息"
                }
                if(!options.chartAmount) {
                    options.chartAmount = 1;
                }
                if(!options.chartAdjust) {
                    options.chartAdjust = 0;
                }
                const inventory = yield app.model.SupplierInventory.findOne({
                    where:{
                        supplierInventoryId:{
                            $eq:options.supplierInventoryId
                        }
                    }
                })
                const result = yield this.create({
                    userId:options.userId,
                    comId:options.comId,
                    spec:inventory.spec,
                    type:inventory.type,
                    supplierId:inventory.supplierId,
                    chartAmount:options.chartAmount,
                    chartAdjust:options.chartAdjust,
                    long:inventory.long,
                    createTime:new Date().getTime()
                });
                return {
                    code:200,
                    msg:"添加购物车成功"
                }
            },
            * update(options) {
                if(!options.chartId) return {
                    code:-1,
                    msg:"修改信息需要购物车主键"
                }
                var data = yield this.findOne({
                    where:{
                        chartId:{
                            $eq:options.chartId
                        }
                    }
                }) 
                if(!data) return {
                    code:-1,
                    msg:"未找到该购物车数据"
                }
                for(var props in options){
                    data[props] = options[props];
                }
                yield data.save();
                return {
                    code:200,
                    msg:"信息修改成功"
                }
            },
            * remove(options) {
                if(!options.chartId) return {
                    code:-1,
                    msg:"请选择要删除的记录"
                }
                const result = yield this.destroy({
                    where:{
                        chartId:{
                            $in:options.chartId.split(','),
                        }
                    }
                })
                if(result) return {
                    code:200,
                    msg:'删除成功'
                }
                return {
                    code:-1,
                    msg:'删除失败'
                };
            }
        }
    })
}