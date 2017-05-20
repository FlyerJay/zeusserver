/**
 * author:flyerjay
 * 2017-04-19
 * 用户角色实体类
 */
'use strict';

module.exports = app => {
    const { STRING, INTEGER} = app.Sequelize;

    return app.model.define('UserRole',{
        userId: {
            type: STRING,
            primaryKey: true,
            allowNull:false,
            comment:"用户Id(主键)"
        },
        comId: {
            type: STRING,
            comment:"公司编号(关联公司信息)"
        },
        adminAuth: {
            type: INTEGER,
            allowNull:false,
            comment:"管理员权限"
        },
        valueAuth: {
            type:INTEGER,
            allowNull:false,
            comment:"价格表权限",
        },
        inventoryAuth: {
            type: INTEGER,
            comment:"库存表权限"
        },
        demandAuth: {
            type: INTEGER,
            comment:"定制化需求权限"
        },
        orderAuth: {
            type: INTEGER,
            comment:"下单权限"
        },
        lastUpdateTime: {
            type: STRING,
            comment:"上次更新时间"
        }
    },{
        freezeTabName:true,
        underscored:true,
		tableName:"user_role",
		timestamps:false,
        classMethods:{
            * update(options){
                if(!options.userId) return {
                    code:-1,
                    msg:"请选择修改的用户"
                }
                if(!options.operator) return{
                    code:-1,
                    msg:"请带上操作人"
                }
                this.update(options,{
                    where:{
                        userId:{
                            $eq:options.userId,
                        }
                    }
                })
                return {
                    code:200,
                    msg:"权限修改成功"
                }
            }
        }
    })
}