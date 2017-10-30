/**
 * author:flyerjay
 * 2017-07-22
 * 需求明细实体类
 */
'use strict';

var Util = require('../utils');

module.exports = app => {
    const { STRING, INTEGER, BIGINT} = app.Sequelize;

    return app.model.define('DemandDetail',{
        demandDetailId: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull:false,
            comment:"需求明细Id",
        },
        demandNo: {
            type: STRING(20),
            allowNull: false,
            comment: "需求编号",
        },
        spec: {
            type: STRING(16),
            allowNull:false,
            comment:"规格"
        },
        type: {
            type: STRING(10),
            allowNull:false,
            comment:"类型"
        },
        demandAmount: {
            type: INTEGER,
            allowNull: false,
            comment:"需求件数"
        },
        perAmount: {
            type:INTEGER,
            allowNull:false,
            default: 0,
            comment:"单件支数"
        },
        demandWeight: {
            type: STRING(20),
            allowNull: true,
            comment:"需求重量"
        },
        factoryPrice: {
            type: INTEGER(11),
            comment: "出厂价",
        },
        feedbackPrice: {
            type: INTEGER(11),
            comment: "需求报价"
        },
        freight: {
            type: INTEGER(11),
            comment: "运费",
        },
        comment: {
            type: STRING(50),
            allowNull: true,
            comment: "需求备注"
        }
    },{
        freezeTabName:true,
        underscored:true,
		tableName:"demand_detail",
		timestamps:false,
        classMethods:{
            * getHistory(options) {
                if(!options.spec) return {
                    code: -1,
                    msg: '缺少规格'
                }

                const result = yield app.model.query(`SELECT DISTINCT dd.factoryPrice as value FROM demand_detail dd
                INNER JOIN demand d
                ON d.demandNo = dd.demandNo
                AND d.priceTime BETWEEN :startTime AND :endTime
                WHERE dd.spec = :spec AND dd.type = :type` ,{
                    replacements: {
                        spec: options.spec,
                        type: options.type,
                        startTime: new Date(Util.getCurrentDate("-")).getTime() - 8 * 60 * 60 * 1000,
                        endTime: new Date(Util.getCurrentDate("-")).getTime() + 16 * 60 * 60 * 1000
                    }
                })

                return {
                    code: 200,
                    data: result[0]
                }
            }
        }
    })
}