/**
 * author:flyerjay
 * 2017-05-09
 * 运费实体类
 */
'use strict';

module.exports = app => {
    const { STRING, INTEGER} = app.Sequelize;

    return app.model.define('Freight',{
        freightId: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull:false,
            comment:"运费主键",
        },
        comId: {
            type: STRING,
            allowNull:false,
            comment:"公司编号(关联公司信息)"
        },
        address: {
            type: STRING,
            allowNull:false,
            comment:"到岸目的地"
        },
        freight: {
            type: STRING,
            allowNull:false,
            comment:"运输费用"
        },
        lastUpdateTime: {
            type: STRING,
            comment:"记录上次更新时间"
        }
    },{
        freezeTabName:true,
        underscored:true,
		tableName:"freight",
		timestamps:false,
        classMethods:{
            * add(options){
                if(!options.comId) return {
                    code:-1,
                    msg:"缺少公司信息:comId"
                }
                if(!options.address) return {
                    code:-1,
                    msg:"缺少到岸目的地:address"
                }
                if(!options.freight) return {
                    code:-1,
                    msg:"缺少运费:fright"
                }
                const result = yield this.findOne({
                    where:{
                        address:{
                            $eq:options.address
                        },
                        comId:{
                            $eq:options.comId
                        }
                    }
                })
                if(result) return {
                    code:-1,
                    msg:"已经存在一条相同的记录"
                }
                yield this.create(Object.assign(options,{lastUpdateTime:new Date().getTime()}));
                return {
                    code:200,
                    msg:"新增成功"
                }
            },
            * update(options){
                var result = yield this.findOne({
                    where:{
                        freightId:{
                            $eq:options.freightId,
                        }
                    }
                })
                if(!result) return{
                    code:-1,
                    msg:'修改的记录不存在'
                }
                for(var props in options){
                    result[props]?result[props] = options[props]:'';
                }
                result.save();
                return {
                    code:200,
                    msg:"修改成功"
                }
            },
            * list(options){
                if(!options.comId) return {
                    code: -1,
                    msg:"缺少公司信息"
                }
                const [$1,$2] = yield [app.model.query(`SELECT * FROM freight 
                WHERE comId = :comId
                ORDER BY lastUpdateTime DESC LIMIT :start,:offset`,{
                    replacements:{
                        comId:options.comId,
                        start:!options.page?0:options.page*(options.pageSize?options.pageSize:30),
                        offset:!options.page?(options.pageSize?(options.pageSize-0):30):(((options.page-0)+1)*(options.pageSize?options.pageSize:30)),
                    }
                }),
                app.model.query(`SELECT count(1) as count FROM freight 
                WHERE comId = :comId
                ORDER BY lastUpdateTime DESC`,{
                    replacements:{
                        comId:options.comId,
                        start:!options.page?0:options.page*(options.pageSize?options.pageSize:30),
                        offset:!options.page?(options.pageSize?(options.pageSize-0):30):(((options.page-0)+1)*(options.pageSize?options.pageSize:30)),
                    }
                })]
                if(!$1[0] || $1[0].length ===0) return {
                    code:-1,
                    msg:"数据为空",
                    data:[]
                }
                let result= {};
                result.row = $1[0];
                result.totalCount = $2[0][0].count;
                result.page = options.page?options.page:0;
                result.pageSize = options.pageSize?options.pageSize:30;
                return {
                    code:200,
                    data:result,
                    msg:"查询成功"
                }
            },
            * remove(options){
                if(!options.freightId) return {
                    code:-1,
                    msg:"缺少运费主键:freightId"
                }
                const result = yield this.destroy({
                    where:{
                        freightId:{
                            $in:options.freightId.split(','),
                        }
                    }
                })
                if(result) return {
                    code:200,
                    msg:'删除成功'
                }
                return {
                    code:-1,
                    msg:'删除失败'
                };
            }
        }
    })
}