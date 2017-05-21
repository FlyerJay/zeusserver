/**
 * author:flyerjay
 * 2017-05-21
 * 定制化需求
 */
'use strict';

module.exports = app => {
    const { STRING, INTEGER} = app.Sequelize;

    return app.model.define('Demand',{
        demandId: {
            type: INTEGER,
            primaryKey: true,
            allowNull:false,
            autoIncrement: true,
            comment:"定制需求主键"
        },
        comId: {
            type: STRING,
            comment:"公司编号(关联公司信息)"
        },
        spec: {
            type: STRING,
            allowNull:false,
            comment:"规格"
        },
        type: {
            type:STRING,
            allowNull:false,
            comment:"类型",
        },
        material: {
            type: STRING,
            comment:"材质"
        },
        demandWeight: {
            type: INTEGER,
            comment:"需求吨位"
        },
        userId: {
            type: STRING,
            comment:"业务员"
        },
        factoryPrice:{
            type: STRING,
            comment:"出厂价"
        },
        freight:{
            type:STRING,
            comment:"运费"
        },
        customerName:{
            type:STRING,
            comment:"客户名称"
        },
        totalPrice:{
            type:STRING,
            comment:"总成本"
        },
        dealStatus:{
            type:INTEGER,
            comment:"成交状态:0:未成交;1:成交成功;2:成交失败"
        },
        dealReason:{
            type:STRING,
            comment:"状态说明"
        },
        timeConsume:{
            type:STRING,
            comment:"需求工时"
        },
        createTime:{
            type:STRING,
            comment:"创建时间"
        }

    },{
        freezeTabName:true,
        underscored:true,
		tableName:"demand",
		timestamps:false,
        classMethods:{
            * add(options){
                if(!options.comId) return {
                    code:-1,
                    msg:"缺少公司信息"
                };
                if(!options.spec) return {
                    code:-1,
                    msg:"缺少规格"
                }
                if(!options.type) return {
                    code:-1,
                    msg:"缺少类型"
                }
                if(!options.userId) return {
                    code:-1,
                    msg:"缺少业务员"
                }
                const data = yield this.create(Object.assign(options,{dealStatus:0,createTime:+new Date()}));
                return {
                    code:200,
                    data:data,
                    msg:"添加定制化需求成功"
                }
            },
            * update(options){
                if(!options.demandId) return {
                    code:-1,
                    msg:"缺少查询主键"
                }
                const result = yield this.findOne({
                    where:{
                        demandId:{
                            $eq:options.demandId
                        }
                    }
                })
                for(var arr in options){
                    result[arr] = options[arr];
                }
                const data = yield result.save();
                return {
                    code:200,
                    msg:"更新数据成功",
                    data,
                }
            },
            * remove(options){
                if(!options.demandId) return {
                    code:-1,
                    msg:"缺少查询主键"
                }
                yield this.destroy({
                    where:{
                        demandId:{
                            $in:options.demandId.split(',')
                        }
                    }
                })
                return {
                    code:200,
                    msg:"删除成功"
                }
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