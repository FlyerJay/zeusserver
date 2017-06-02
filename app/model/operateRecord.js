/**
 * author:flyerjay
 * 2017-05-21
 * 操作记录实体类
 */
'use strict';

module.exports = app => {
    const { STRING, INTEGER, BIGINT } = app.Sequelize;

    return app.model.define('OperateRecord',{
        recordId:{
            type:INTEGER,
            primaryKey:true,
            allowNull:false,
            autoIncrement: true,
            comment:"记录主键"
        },
        userId: {
            type: STRING(20),
            allowNull:false,
            comment:"操作人"
        },
        comId: {
            type: STRING(2),
            comment:"公司编号(关联公司信息)"
        },
        type:{
            type:STRING(10),
            comment:"操作类型"
        },
        detail:{
            type:STRING(100),
            comment:"操作详情"
        },
        createTime:{
            type:BIGINT(20),
            comment:"操作时间"
        }
    },{
        freezeTabName:true,
        underscored:true,
		tableName:"operate_record",
		timestamps:false,
        classMethods:{
            * list(options){
                if(!options.comId) return {
                    code:-1,
                    msg:"缺少公司信息"
                }
                const result = yield this.findAndCountAll({
                    where:{
                        comId:{
                            $eq:options.comId
                        }
                    }
                })
                return {
                    code:200,
                    data:{
                        totalCount:result.count,
                        row:result.rows
                    },
                    msg:"查询成功",
                }
            }
        }
    })
}