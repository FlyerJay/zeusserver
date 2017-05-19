/**
 * author:flyerjay
 * 2017-04-20
 * 供应商价格实体类
 */
'use strict';

module.exports = app => {
    const { STRING, INTEGER } = app.Sequelize;

    return app.model.define('SupplierValue',{
        supplierValueId: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull:false,
            comment:"价格表主键",
        },
        supplierId: {
            type: INTEGER,
            allowNull:false,
            comment:"供应商编号",
        },
        comId: {
            type:STRING,
            allowNull:false,
            comment:"公司编号",
        },
        spec: {
            type: STRING,
            allowNull:false,
            comment:"规格"
        },
        lastUpdateTime: {
            type:INTEGER,
            allowNull:false,
            comment:"最近更新时间"
        },
        type: {
            type:STRING,
            comment:"类别"
        },
        value: {
            type:STRING,
            comment:"出厂价"
        },
        material: {
            type:STRING,
            comment:"材质"
        }
    },{
        freezeTabName:true,
        underscored:true,
		tableName:"supplier_value",
		timestamps:false,
        classMethods:{
            associate(){
                app.model.SupplierValue.belongsTo(app.model.Supplier,{foreignKey:'supplierId',targetKey:'supplierId'});
            },
            * getList(options) {
                if(!options.comId) return {
                    code:-1,
                    msg:"缺少公司信息"
                }
                var addressCondition = '';
                if(options.address){
                    addressCondition = `AND s.address = :address`
                }
                var typeCondition = '';
                if(options.type){
                    typeCondition = `AND si.type = :type`
                }
                const [$1,$2] = yield [app.model.query(`SELECT sv.supplierValueId,sv.supplierId,sv.comId,sv.spec,sv.type,sv.value,sv.material,sv.lastUpdateTime,
                s.supplierName,s.address,s.benifit
                FROM supplier_value sv
                LEFT JOIN supplier s ON
                s.supplierName LIKE :supplierName
                AND s.comId LIKE sv.comId
                AND s.supplierId = sv.supplierId
                ${addressCondition}
                WHERE sv.spec LIKE :spec
                AND sv.comId = :comId
                ${typeCondition}
                ORDER BY sv.lastUpdateTime DESC
                LIMIT :start,:offset`,{
                    replacements:{
                        address:options.address?options.address:'',
                        comId:options.comId,
                        supplierName:options.supplierName?`%${options.supplierName}%`:'%%',
                        spec:options.spec?`%${options.spec}%`:'%%',
                        type:options.type?options.type:'',
                        start:!options.page?0:options.page*(options.pageSize?options.pageSize:30),
                        offset:!options.page?(options.pageSize?(options.pageSize-0):30):(((options.page-0)+1)*(options.pageSize?options.pageSize:30)),
                    }
                }),
                app.model.query(`SELECT count(1) as count
                FROM supplier_value sv
                LEFT JOIN supplier s ON
                s.supplierName LIKE :supplierName
                AND s.comId LIKE sv.comId
                AND s.supplierId = sv.supplierId
                ${addressCondition}
                WHERE sv.spec LIKE :spec
                AND sv.comId = :comId
                ${typeCondition}
                ORDER BY sv.lastUpdateTime DESC
                LIMIT :start,:offset`,{
                    replacements:{
                        address:options.address?options.address:'',
                        comId:options.comId,
                        supplierName:options.supplierName?`%${options.supplierName}%`:'%%',
                        spec:options.spec?`%${options.spec}%`:'%%',
                        type:options.type?options.type:'',
                        start:!options.page?0:options.page*(options.pageSize?options.pageSize:30),
                        offset:!options.page?(options.pageSize?(options.pageSize-0):30):(((options.page-0)+1)*(options.pageSize?options.pageSize:30)),
                    }
                })]
                if(!$1[0] || $1[0].length === 0) return {
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
                    msg:"查询成功",
                    data:result,
                }
            },
            * addValue(options) {
                if (!options.supplierId) return {
                    code: -1,
                    msg: '请选择供应商',
                }
                if(!options.spec) return {
                    code: -1,
                    msg: '规格不能为空'
                }
                if(!options.type) return {
                    code: -1,
                    msg: '货物类别不能为空'
                }
                if(!options.comId) return {
                    code: -1,
                    msg: '缺少公司信息'
                }
                var time = String(new Date().getFullYear())+String((new Date().getMonth()+1)<10?'0'+(new Date().getMonth()+1):(new Date().getMonth()+1))+String(new Date().getDate()<10?'0'+new Date().getDate():new Date().getDate());
                const result = yield this.create(Object.assign(options,{lastUpdateTime:Number(time)}));
                return {
                    code:200,
                    msg:"添加数据成功",
                    data:result
                }
            },
            * updateValue(options) {
                if(!options.supplierId) return {
                    code: -1,
                    msg: '缺少必要参数'
                }
                const result = yield this.update(options,{
                    where :{
                        supplierInventoryId:{
                            $eq:options.supplierValueId,
                        }
                    }
                })
                if(!result) return{
                    code: -1,
                    msg: '更新出错'
                }
                if(result == 0) return {
                    code: -1,
                    msg: '没有任何更新'
                }
                return {
                    code: 200,
                    msg: '更新数据成功'
                }
            },
            * deleteValue(options) {
                if(!options.supplierId) return {
                    code: -1,
                    msg: '缺少必要参数'
                }
                const result = yield this.destroy({
                    where :{
                        supplierInventoryId:{
                            $eq:options.supplierValueId,
                        }
                    }
                })

                if(!result) return {
                    code: -1,
                    msg: '删除错误'
                }
                if(result == 0) return {
                    code: -1,
                    msg: '受影响数据为0'
                }
                return {
                    code: 200,
                    msg: '删除数据成功'
                }
            }
        }
    })
}