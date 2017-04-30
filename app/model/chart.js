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
            *getList(options) {
                const result = {};
                const [[data]] = yield app.model.query('SELECT ',
                {
                    replacements:{

                    }
                })
            }
        }
    })
}