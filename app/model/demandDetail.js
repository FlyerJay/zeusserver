/**
 * author:flyerjay
 * 2017-07-22
 * 需求明细实体类
 */
'use strict';

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
        demandId: {
            type: INTEGER,
            allowNull:false,
            comment:"需求ID，与需求表作关联"
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
            comment:"单件支数"
        },
        demandWeight: {
            type: STRING(20),
            allowNull: true,
            comment:"需求重量"
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
        }
    })
}