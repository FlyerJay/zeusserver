/**
 * author:flyerjay
 * 2017-04-19
 * 购物车实体类
 */
'use strict';
var uuid = require('uuid');

module.exports = app => {
    const { STRING, INTEGER, DATE, UUID } = app.Sequelize;

    return app.model.define('Chart',{
        chartId: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull:false,
            comment:"购物车Id(主键无实际意义)",
        },
        userId: {
            type: STRING,
            allowNull:false,
            comment:"用户Id(主键)"
        },
        comId: {
            type: STRING,
            allowNull:false,
            comment:"公司编号(关联公司信息)"
        },
        supplierInventoryId: {
            type: INTEGER,
            allowNull: false,
            comment:"库存编号（关联库存信息）"
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
            type: STRING,
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
                const [$1,$2] = yield [app.model.query(`SELECT c.chartAmount,c.chartAdjust,si.spec,si.type,s.supplierName,f.freight,s.benifit,sv.value FROM chart c
                LEFT JOIN supplier_inventory si ON
                si.supplierInventoryId = c.supplierInventoryId
                LEFT JOIN supplier_value sv ON
                si.spec = sv.spec AND
                si.type = sv.type AND
                si.material = sv.material
                LEFT JOIN supplier s ON
                s.supplierId = si.supplierId
                LEFT JOIN freight f ON
                f.address = s.address
                WHERE c.userId = :userId AND
                c.comId = :comId
                ORDER BY c.createTime DESC
                LIMIT :start,:offset`,
                {
                    replacements:{
                        userId:options.userId?options.userId:'',
                        comId:options.comId?options.comId:'',
                        start:!options.page?0:options.page*(options.pageSize?options.pageSize:30),
                        offset:!options.page?(options.pageSize?(options.pageSize-0):30):(((options.page-0)+1)*(options.pageSize?options.pageSize:30)),
                    }
                }),
                app.model.query(`SELECT count(1) AS count FROM chart c
                LEFT JOIN supplier_inventory si ON
                si.supplierInventoryId = c.supplierInventoryId
                LEFT JOIN supplier_value sv ON
                si.spec = sv.spec AND
                si.type = sv.type AND
                si.material = sv.material
                LEFT JOIN supplier s ON
                s.supplierId = si.supplierId
                LEFT JOIN freight f ON
                f.address = s.address
                WHERE c.userId = :userId AND
                c.comId = :comId
                ORDER BY c.createTime DESC
                LIMIT :start,:offset`,
                {
                    replacements:{
                        userId:options.userId?options.userId:'',
                        comId:options.comId?options.comId:'',
                        start:!options.page?0:options.page*(options.pageSize?options.pageSize:30),
                        offset:!options.page?(options.pageSize?(options.pageSize-0):30):(((options.page-0)+1)*(options.pageSize?options.pageSize:30)),
                    }
                })]
                if(!$1[0] || $1[0].length === 0) return {
                    code:-1,
                    msg:"数据为空",
                    data:[]
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
                const result = yield this.create(Object.assign(options,{createTime:new Date().getTime()}));
                return {
                    code:200,
                    msg:"添加购物车成功"
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