/**
 * author:flyerjay
 * 2017-04-19
 * 供应商实体类
 */
'use strict';

module.exports = app => {
    const { STRING, INTEGER } = app.Sequelize;

    return app.model.define('Supplier',{
        supplierId: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull:false,
            comment:"供应商编号",
        },
        supplierName: {
            type: STRING,
            allowNull:false,
            comment:"供应商名称"
        },
        comId: {
            type:STRING,
            allowNull:false,
            comment:"公司编号"
        },
        address: {
            type:STRING,
            allowNull:false,
            comment:"供应商地址"
        },
        benifit: {
            type:STRING,
            comment:"优惠"
        }
    },{
        freezeTabName:true,
		tableName:"supplier",
        underscored:true,
		timestamps:false,
        classMethods:{
            * getList(options){
                if(!options.comId) return {
                    code:-1,
                    msg:"缺少公司信息"
                }
                let condition = '';
                if(options.address) {
                    condition = `AND s.address = :address`
                }
                const result = app.model.query(`SELECT s.supplierId,s.supplierName,s.comId,s.address,s.benifit,f.freight 
                FROM supplier s
                LEFT JOIN freight f ON
                f.comId = s.comId AND
                f.address = s.address
                WHERE s.comId = :comId AND
                s.supplierName LIKE :supplierName
                ${condition}
                LIMIT :start,:offset`,{
                    replacements:{
                        supplierName:options.supplierName?`%${options.supplierName}%`:'',
                        comId:options.comId,
                        address:options.address?options.address:'',
                        start:!options.page?0:options.page*(options.pageSize?options.pageSize:30),
                        offset:!options.page?(options.pageSize?(options.pageSize-0):30):(((options.page-0)+1)*(options.pageSize?options.pageSize:30)),
                    }
                })
                console.log(result)
                if(!result[0] || result[0].length === 0) return {
                    code:-1,
                    msg:"数据为空"
                }
                return {
                    code:200,
                    msg:"查询成功",
                    data:result[0],
                }
            },
            * update(options){
                var result = yield this.findOne({
                    where:{
                        supplierId:{
                            $eq:options.supplierId,
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
            * add(options){
                if(!options.comId) return {
                    code:-1,
                    msg:"缺少公司信息"
                }
                return yield this.create(options);
            },
            * remove(options){
                const result = yield this.destroy({
                    where:{
                        supplierId:{
                            $in:options.supplierId.split(','),
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
            },
            * address(){
                const result = yield app.model.query(`SELECT DISTINCT address from supplier`);
                return {
                    code:200,
                    data:result[0]
                }
            }
        }
    })
}