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
            allowNull: false,
            comment: "供应商编号",
        },
        supplierName: {
            type: STRING(15),
            allowNull: false,
            comment: "供应商名称"
        },
        comId: {
            type: STRING(2),
            allowNull: false,
            comment: "公司编号"
        },
        address: {
            type: STRING(20),
            allowNull: false,
            comment: "供应商地址"
        },
        benifit: {
            type: INTEGER,
            comment: "优惠"
        },
        isDelete:{
            type: STRING(1),
            comment: "是否删除"
        },
        benifitAdjust:{
            type: INTEGER,
            default: 0,
            comment: "优惠浮动"
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
                const [$1,$2] = yield [app.model.query(`SELECT s.supplierId,s.supplierName,s.comId,s.address,s.benifit,f.freight 
                FROM supplier s
                LEFT JOIN freight f ON
                f.comId = :comId AND
                f.address = s.address
                WHERE s.comId = "00" AND
                s.supplierName LIKE :supplierName
                AND s.isDelete = 'N'
                ${condition}
                LIMIT :start,:offset`,{
                    replacements:{
                        supplierName:options.supplierName?`%${options.supplierName}%`:'%%',
                        comId:options.comId,
                        address:options.address?options.address:'',
                        start:!options.page?0:(options.page - 1)*(options.pageSize?options.pageSize:15),
                        offset:options.pageSize?options.pageSize:15,
                    }
                }),
                app.model.query(`SELECT count(1) as count 
                FROM supplier s
                LEFT JOIN freight f ON
                f.comId = :comId AND
                f.address = s.address
                WHERE s.comId = "00" AND
                s.supplierName LIKE :supplierName
                AND s.isDelete = 'N'
                ${condition}`,{
                    replacements:{
                        supplierName:options.supplierName?`%${options.supplierName}%`:'%%',
                        comId:options.comId,
                        address:options.address?options.address:'',
                        start:!options.page?0:(options.page - 1)*(options.pageSize?options.pageSize:15),
                        offset:options.pageSize?options.pageSize:15,
                    }
                })]
                if(!$1[0] || $1[0].length === 0) return {
                    code:200,
                    msg:"数据为空",
                    data:{
                        count:0,
                        row:[]
                    }
                }
                let result= {};
                result.row = $1[0];
                result.totalCount = $2[0][0].count;
                result.page = options.page?options.page:0;
                result.pageSize = options.pageSize?options.pageSize:15;
                return {
                    code:200,
                    msg:"查询成功",
                    data:result,
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
                var keys = '';
                var values = '';
                var value = '';
                var lastBenifit = result.dataValues.benifit;
                for(var props in options){
                    if(props == 'freight'){
                        yield app.model.query('UPDATE freight SET freight = :freight WHERE address = :address AND comId = :comId',{
                            replacements:{
                                address: options.address?options.address:'',
                                freight: options.freight - 0,
                                comId: options.comId,
                            }
                        })
                    }
                    else if(props == 'benifit'){
                        yield app.model.query(`UPDATE supplier SET benifit = :benifit,benifitAdjust = :benifitAdjust WHERE supplierId = :supplierId`,{
                            replacements:{
                                supplierId:options.supplierId,
                                benifit: options.benifit - 0,
                                benifitAdjust: options.benifit - lastBenifit,
                            }
                        })
                    }else if(props != 'row' && props != 'userId' && props != 'role'){
                        yield app.model.query(`UPDATE supplier SET ${props} = :value WHERE supplierId = :supplierId`,{
                            replacements:{
                                supplierId:options.supplierId,
                                value:options[props]+''
                            }
                        })
                    }
                   
                }
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
                options.comId = "00";
                if(!options.supplierName) return {
                    code:-1,
                    msg:"请输入供应商名称"
                }
                if(!options.address) return {
                    code:-1,
                    msg:"请选择供应商地址"
                }
                options.isDelete = 'N';
                const isExsit = yield this.findOne({
                    where:{
                        supplierName:{
                            $eq:options.supplierName
                        },
                        comId:{
                            $eq:"00"
                        }
                    }
                })
                if(isExsit) return {
                    code:-1,
                    msg:"已经存在相同的记录"
                }
                const result = yield this.create(options);
                return {
                    code:200,
                    msg:"添加成功",
                    data:result
                }
            },
            * remove(options){
                const result = yield app.model.query("update supplier set isDelete = 'Y' where supplierId in (:supplierIds)",{
                    replacements:{
                        supplierIds:options.supplierId.split(',')
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
            * address(options){
                if(!options.comId) return {
                    code:-1,
                    msg:"缺少公司信息:comId"
                }
                const result = yield app.model.query(`SELECT DISTINCT address from freight WHERE comId = :comId`,{
                    replacements:{
                        comId:options.comId,
                    }
                });
                return {
                    code:200,
                    data:result[0]
                }
            }
        }
    })
}