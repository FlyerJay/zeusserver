/**
 * author:flyerjay
 * 2017-04-20
 * 供应商库存实体类
 */
'use strict';

module.exports = app => {
    const { STRING, INTEGER } = app.Sequelize;

    return app.model.define('SupplierInventory',{
        supplierInventoryId: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull:false,
            comment:"库存表主键",
        },
        supplierId: {
            type: INTEGER,
            allowNull:false,
            comment:"供应商编号",
        },
        comId: {
            type:STRING(2),
            allowNull:false,
            comment:"公司编号"
        },
        spec: {
            type: STRING(20),
            allowNull:false,
            comment:"规格"
        },
        lastUpdateTime: {
            type:INTEGER,
            allowNull:false,
            comment:"最近更新时间"
        },
        type: {
            type:STRING(10),
            allowNull:false,
            comment:"类别"
        },
        material: {
            type:STRING(10),
            comment:"材质"
        },
        inventoryAmount: {
            type:INTEGER,
            comment:"库存数量"
        },
        perAmount: {
            type:INTEGER,
            comment:"单件支数"
        },
        inventoryWeight: {
            type:STRING(20),
            comment:"库存重量"
        },
        long:{
            type:STRING(10),
            comment:"长度"
        }
    },{
        freezeTabName:true,
        underscored:true,
		tableName:"supplier_inventory",
		timestamps:false,
        classMethods:{
            * getList(options) {
                if(!options.comId) return {
                    code:-1,
                    msg:"缺少公司信息"
                }
                var addressCondition = '';
                if(options.address){
                    addressCondition = `AND s.address = :address`
                }
                var typeCondition = '';
                if(options.type){
                    typeCondition = `AND si.type = :type`
                }
                const [$1,$2] = yield [app.model.query(`SELECT si.supplierInventoryId,si.supplierId,si.comId,si.spec,si.lastUpdateTime,
                si.type,si.material,si.long,si.inventoryAmount,si.perAmount,si.inventoryWeight,s.supplierName,s.address,s.benifit,f.freight FROM supplier_inventory si
                INNER JOIN supplier s ON
                s.comId = si.comId
                AND s.supplierName LIKE :supplierName
                AND s.supplierId = si.supplierId
                ${addressCondition}
                LEFT JOIN freight f ON
                f.address = s.address
                WHERE si.spec LIKE :spec
                AND si.comId = :comId
                ${typeCondition}
                ORDER BY si.lastUpdateTime DESC,si.supplierId,si.type,si.spec
                LIMIT :start,:offset`,{
                    replacements:{
                        address:options.address?options.address:'',
                        comId:options.comId,
                        supplierName:options.supplierName?`%${options.supplierName}%`:'%%',
                        spec:options.spec?`%${options.spec}%`:'%%',
                        type:options.type?options.type:'',
                        start:!options.page?0:(options.page - 1)*(options.pageSize?options.pageSize:30),
                        offset:options.pageSize?options.pageSize:30,
                    }
                }),
                app.model.query(`SELECT count(1) as count FROM supplier_inventory si
                INNER JOIN supplier s ON
                s.comId = si.comId
                AND s.supplierName LIKE :supplierName
                AND s.supplierId = si.supplierId
                ${addressCondition}
                LEFT JOIN freight f ON
                f.address = s.address
                WHERE si.spec LIKE :spec
                AND si.comId = :comId
                ${typeCondition}
                ORDER BY si.lastUpdateTime DESC,si.supplierId,si.type,si.spec`,{
                    replacements:{
                        address:options.address?options.address:'',
                        comId:options.comId,
                        supplierName:options.supplierName?`%${options.supplierName}%`:'%%',
                        spec:options.spec?`%${options.spec}%`:'%%',
                        type:options.type?options.type:'',
                        start:!options.page?0:(options.page - 1)*(options.pageSize?options.pageSize:30),
                        offset:options.pageSize?options.pageSize:30,
                    }
                })]
                if(!$1[0] || $1[0].length === 0) return {
                    code:200,
                    msg:"数据为空",
                    data:{
                        count:0,
                        row:[]
                    }
                }
                let result= {};
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
            * addInventory(options) {
                if (!options.supplierId) return {
                    code: -1,
                    msg: '请选择供应商',
                }
                if(!options.spec) return {
                    code: -1,
                    msg: '规格不能为空'
                }
                if(!options.type) return {
                    code: -1,
                    msg: '货物类别不能为空'
                }
                if(!options.comId) return {
                    code: -1,
                    msg: '缺少公司信息'
                }
                var time = String(new Date().getFullYear())+String((new Date().getMonth()+1)<10?'0'+(new Date().getMonth()+1):(new Date().getMonth()+1))+String(new Date().getDate()<10?'0'+new Date().getDate():new Date().getDate());
                return yield this.create(Object.assign(options,{lastUpdateTime:Number(time)}));
            },
            * updateInventory(options) {
                if(!options.supplierInventoryId) return {
                    code: -1,
                    msg: '缺少必要参数'
                }
                const result = yield this.update(options,{
                    where :{
                        supplierInventoryId:{
                            $eq:options.supplierInventoryId,
                        }
                    }
                })
                if(!result) return{
                    code: -1,
                    msg: '更新出错'
                }
                if(result == 0) return {
                    code: -1,
                    msg: '没有任何更新'
                }
                return {
                    code: 200,
                    msg: '更新数据成功'
                }
            },
            * deleteInventory(options) {
                if(!options.supplierId) return {
                    code: -1,
                    msg: '缺少必要参数'
                }
                const result = yield this.destroy({
                    where :{
                        supplierInventoryId:{
                            $eq:options.supplierInventoryId,
                        }
                    }
                })

                if(!result) return {
                    code: -1,
                    msg: '删除错误'
                }
                if(result == 0) return {
                    code: -1,
                    msg: '受影响数据为0'
                }
                return {
                    code: 200,
                    msg: '删除数据成功'
                }
            },
            * queryProduct(options){
                var result = {};
                const [$1,$2] = yield [app.model.query(`SELECT si.supplierInventoryId,si.spec,
                    si.type,si.material,si.long,si.inventoryAmount,si.perAmount,si.inventoryWeight,s.supplierId,s.supplierName,s.address,f.freight,s.benifit,sv.value,
                    CASE WHEN sv.time <> '' AND sv.time > si.lastUpdateTime THEN sv.time ELSE si.lastUpdateTime END as lastUpdateTime
                    FROM supplier_inventory si
                    INNER JOIN supplier s
                    ON s.supplierId = si.supplierId
                    AND s.comId = si.comId
                    AND (s.address = :address OR :address = '')
                    LEFT JOIN (SELECT *,MAX(lastUpdateTime) AS time FROM supplier_value GROUP BY supplierId,type,spec) sv
                    ON si.supplierId = sv.supplierId
                    AND si.type = sv.type
                    AND si.material = sv.material
                    AND si.spec = sv.spec
                    AND sv.comId = si.comId
                    LEFT JOIN freight f ON
                    f.address = s.address
                    AND f.comId = si.comId
                    WHERE si.spec LIKE :spec
                    AND (si.type = :type OR :type = '')
                    ORDER BY si.lastUpdateTime DESC,si.supplierId,si.type,si.spec
                    LIMIT :start,:offset`,{
                        replacements:{
                            spec:options.spec?`%${options.spec}%`:'%%',
                            type:options.type?options.type:'',
                            start:!options.page?0:(options.page - 1)*(options.pageSize?options.pageSize:30),
                            offset:options.pageSize?options.pageSize:30,
                            address:options.address?options.address:''
                        }
                    }),
                    app.model.query(`SELECT count(1) as count
                    FROM supplier_inventory si
                    INNER JOIN supplier s
                    ON s.supplierId = si.supplierId
                    AND s.comId = si.comId
                    AND (s.address = :address OR :address = '')
                    LEFT JOIN (SELECT *,MAX(lastUpdateTime) AS time FROM supplier_value GROUP BY supplierId,type,spec) sv
                    ON si.supplierId = sv.supplierId
                    AND si.type = sv.type
                    AND si.material = sv.material
                    AND si.spec = sv.spec
                    AND sv.comId = si.comId
                    LEFT JOIN freight f ON
                    f.address = s.address
                    AND f.comId = si.comId
                    WHERE si.spec LIKE :spec
                    AND (si.type = :type OR :type = '')
                    ORDER BY si.lastUpdateTime DESC,si.supplierId,si.type,si.spec`,{
                        replacements:{
                            spec:options.spec?`%${options.spec}%`:'%%',
                            type:options.type?options.type:'',
                            address:options.address?options.address:''
                        }
                    })
                    ]
                if(!$1[0] || $1[0].length <= 0) return {
                    code:200,
                    msg:'查询数据为空',
                    data:{
                        count:0,
                        row:[]
                    }
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
            }
        }
    })
}