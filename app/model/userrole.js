/**
 * author:flyerjay
 * 2017-04-19
 * 用户角色实体类
 */
'use strict';

module.exports = app => {
    const { STRING, INTEGER, BIGINT} = app.Sequelize;

    return app.model.define('UserRole',{
        userId: {
            type: STRING(20),
            primaryKey: true,
            allowNull:false,
            comment:"用户Id(主键)"
        },
        comId: {
            type: STRING(2),
            comment:"公司编号(关联公司信息)"
        },
        adminAuth: {
            type: INTEGER,
            allowNull:false,
            comment:"管理员权限"
        },
        supplierAuth:{
            type:INTEGER,
            allowNull:false,
            comment:"供应商录入权限"
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
            type: BIGINT(20),
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
                if(!options.operator) return{
                    code:-1,
                    msg:"请选择要操作的人:operator"
                }
                var self = this;
                return app.model.transaction(async (t)=>{
                    return await self.findOne({
                        where:{
                            userId:{
                                $eq:options.operator,
                            }
                        },
                        transaction:t
                    }).then(async (res)=>{
                        for(var arr in options){
                            res[arr] = options[arr];
                        }
                        res.save({transaction:t});
                        return await app.model.OperateRecord.create({
                            userId:options.userId,
                            comId:options.comId,
                            type:'修改用户权限',
                            detail:`修改了用户${options.operator}的权限`,
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
            * getUserRole(options){
                const result = yield this.findOne({
                    where:{
                        userId:{
                            $eq:options.userId
                        },
                        comId:{
                            $eq:options.comId
                        }
                    }
                })
                const _role = result.dataValues;
                return `${_role['adminAuth']}${_role['valueAuth']}${_role['inventoryAuth']}${_role['supplierAuth']}${_role['demandAuth']}${_role['orderAuth']}`;;
            },
            * list(options){
                if(!options.comId) return {
                    code:-1,
                    msg:"缺少公司信息"
                }
                const list = yield this.findAndCountAll({
                    offset:!options.page?0:(options.page - 1)*(options.pageSize?options.pageSize:30),
                    limit:options.pageSize?options.pageSize:30,
                    where:{
                        comId:{
                            $eq:options.comId,
                        },
                        userId:{
                            $ne:options.userId,
                        }
                    }
                })
                return {
                    code:200,
                    msg:"查询数据成功",
                    data:{
                        totalCount:list.count,
                        row:list.rows,
                        page:options.page?options.page:1,
                        pageSize:options.pageSize?options.pageSize:30,
                    }
                }
            }
        }
    })
}