/**
 * author:flyerjay
 * 2017-05-21
 * 操作记录实体类
 */
'use strict';

module.exports = app => {
    const { STRING, INTEGER} = app.Sequelize;

    return app.model.define('operateRecord',{
        recordId:{
            type:INTEGER,
            primaryKey:true,
            allowNull:false,
            comment:"记录主键"
        },
        userId: {
            type: STRING,
            allowNull:false,
            comment:"操作人"
        },
        comId: {
            type: STRING,
            comment:"公司编号(关联公司信息)"
        },
        type:{
            type:STRING,
            comment:"操作类型"
        },
        detail:{
            type:STRING,
            comment:"操作详情"
        },
        createTime:{
            type:STRING,
            comment:"操作时间"
        }
    },{
        freezeTabName:true,
        underscored:true,
		tableName:"operate_record",
		timestamps:false,
    })
}