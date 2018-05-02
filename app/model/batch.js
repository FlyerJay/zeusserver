/**
 * 批量搜索实体类
 * 2018-05-02
 */
'use strict';

module.exports = app => {
     const { STRING, INTEGER, BIGINT} = app.Sequelize;
     return app.model.define('Batch',{
        batchId: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull:false,
            comment:"批量搜索结果（无实义）",
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
        supplierId: {
            type: STRING(2),
            primaryKey: true,
            allowNull: false,
            comment: "供应商Id",
        },
        supplierName: {
            type: STRING(10),
            allowNull: true,
            comment: "供应商名字",
        },
        totalPrice: {
            type: STRING(10),
            allowNull: false,
            default: '',
            comment: "到岸总价格",
        },
        createTime: {
            type: BIGINT(20),
            comment:"记录创建时间"
        },
     }, {
        freezeTabName: true,
        underscored: true,
		tableName: "batch",
		timestamps: false,
        classMethods:{
            *batch(options) {
                let paramLines = options.searchData.split("\n");
                let params = [];
                let indexs = {};
                let weights = {};
                paramLines.forEach( (v,i)=> {
                    var vArr = v.split(/\s+/);
                    params[i] = {};
                    params[i].spec = vArr[0] || '';
                    params[i].type = vArr[1] || '';
                    params[i].inventory = vArr[2] || '';
                    params[i].long = vArr[3] || '';
                    let specArr = vArr[0].split("*");
                    let perimeter = 2 * specArr[0] + 2 * specArr[1];
                    let land = Number(specArr[2]);
                    let weight = (perimeter / 3.14 - land) * land * (specArr[3] || 6) * 0.02466 * Number(vArr[2]) / 1000;
                    indexs[vArr[0]] = {
                        index: i,
                        weight: weight
                    };
                });
                var resultArr = yield params.map( (v,i) => {
                    return app.model.query(`SELECT si.supplierInventoryId,si.spec,
                    si.type,si.material,si.long,si.inventoryAmount,si.perAmount,si.inventoryWeight,si.mark,s.supplierId,s.supplierName,s.address,f.freight,sr.benifit,sv.value,
                    si.lastUpdateTime as inventoryTime, sv.lastUpdateTime as valueTime,sv.adjustValue,(sv.adjustValue - sr.benifitAdjust) as priceAdjust,sr.benifitAdjust,(sv.value - sr.benifit) as purePrice, (sv.value - sr.benifit + f.freight) as daPrice,
                    CASE WHEN sv.time <> '' AND sv.time > si.lastUpdateTime THEN sv.time ELSE si.lastUpdateTime END as lastUpdateTime
                    FROM supplier_inventory si
                    INNER JOIN supplier s
                    ON s.isDelete = 'N'
                    INNER JOIN supplier_relate sr
                    ON sr.supplierId = s.supplierId
                    AND sr.supplierId = si.supplierId
                    AND sr.comId = :comId
                    AND sr.isValide = 1
                    LEFT JOIN (select *,sv.lastUpdateTime as time from (select * from supplier_value order by lastUpdateTime desc limit 0,100000000) sv group by supplierId,type,spec) sv
                    ON si.supplierId = sv.supplierId
                    AND si.type = sv.type
                    AND si.material = sv.material
                    AND si.spec = sv.spec
                    LEFT JOIN freight f ON
                    f.address = s.address
                    AND f.comId = :comId
                    WHERE si.spec = :spec
                    AND si.type = :type
                    AND sv.value <> ''
                    AND si.inventoryAmount >= :inventory 
                    AND (si.long = :long OR :long = '')
                    ORDER BY daPrice ASC`, {
                        replacements: {
                            comId: options.comId,
                            spec: v.spec,
                            type: v.type,
                            inventory: v.inventory,
                            long: v.long
                        }
                    })
                })
                let formatResult = [];
                resultArr.map((v, i) => {
                    formatResult[i] = v[0];
                })
                formatResult.map(v => {
                    v.map(vv => {
                        let spec = vv.spec;
                        vv.weight = indexs[spec].weight;
                        vv.totalPrice = Number((vv.weight * Number(vv.daPrice)).toFixed(2));
                        return vv;
                    })
                });
                var bestResolve = {};
                var bestResolveList = [];
                formatResult.forEach(v => {
                    bestResolveList.push(v[0]);
                })
                bestResolve.name = "最低价解决方案";
                bestResolve.supplierName = "--";
                bestResolve.list = bestResolveList;
                var price = 0;
                bestResolveList.map(v => {
                    price += Number(v.totalPrice);
                })
                bestResolve.price = price.toFixed(2);
                var cache = {};
                formatResult.forEach(v => {
                    v.forEach(vv => {
                        cache[vv.supplierId] ? cache[vv.supplierId] ++ : cache[vv.supplierId] = 1;
                    })
                });
                var keys = Object.keys(cache);
                var otherList = [];
                keys.forEach(key => {
                    if(cache[key] == paramLines.length && otherList.length < 5) {
                        let otherResolve = {};
                        let otherResolveList = [];
                        formatResult.forEach(v => {
                            v.forEach(vv => {
                                if(vv.supplierId == key) {
                                    otherResolveList.push(vv);
                                }
                            })
                        })
                        otherResolve.name = "单一供应商方案";
                        otherResolve.supplierName = otherResolveList[0].supplierName
                        otherResolve.list = otherResolveList;
                        var price = 0;
                        otherResolveList.map(v => {
                            price += Number(v.totalPrice);
                        })
                        otherResolve.price = price.toFixed(2);
                        otherList.push(otherResolve);
                    }
                })
                var result = {};
                result.row = [bestResolve].concat(otherList);
                result.totalCount = otherList.length + 1;
                result.page = 1;
                result.pageSize = 30;
                return {
                    code: 200,
                    data: result,
                    msg: "批量上传成功"
                }
            }
        }
    })
}