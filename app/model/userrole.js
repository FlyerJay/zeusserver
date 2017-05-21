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
                if(!options.comId) return {
                    code:-1,
                    msg:"缺少公司信息"
                }
                if(!options.userId) return {
                    code:-1,
                    msg:"请选择修改的用户"
                }
                if(!options.operator) return{
                    code:-1,
                    msg:"请带上操作人Id:operator"
                }
                var self = this;
                return app.model.transaction(async (t)=>{
                    return await self.findOne({
                        where:{
                            userId:{
                                $eq:options.userId,
                            }
                        },
                        transaction:t
                    }).then(async (res)=>{
                        for(var arr in options){
                            res[arr] = options[arr];
                        }
                        res.save({transaction:t});
                        return await app.model.OperateRecord.create({
                            userId:options.operator,
                            comId:options.comId,
                            type:'修改用户权限',
                            detail:`修改了用户${options.userId}的权限`,
                            createTime:+new Date()
                        },{transaction:t})
                    })
                }).then((res)=>{
                    return {
                        code:200,
                        msg:"权限修改成功",
                        data:res
                    }
                }).catch((err)=>{
                    return {
                        code:-1,
                        msg:'修改权限出错',
                        data:err
                    };
                })
            },
            * list(options){
                if(!options.comId) return {
                    code:-1,
                    msg:"缺少公司信息"
                }
                const list = yield this.findAndCountAll({
                    offset:!options.page?0:options.page*(options.pageSize?options.pageSize:30),
                    limit:!options.page?(options.pageSize?(options.pageSize-0):30):(((options.page-0)+1)*(options.pageSize?options.pageSize:30)),
                    where:{
                        comId:{
                            $eq:options.comId
                        }
                    }
                })
                return {
                    code:200,
                    msg:"查询数据成功",
                    data:list
                }
            }
        }
    })
}