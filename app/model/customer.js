/**
 * author:flyerjay
 * 2017-09-10
 * 客户实体类
 */
'use strict';

module.exports = app => {
    const { STRING, INTEGER } = app.Sequelize;
    return app.model.define('Customer',{
        customerId: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            comment: "客户编号（主键）"
        },
        destination: {
            type: STRING(20),
            allowNull: false,
            comment: "目的地"
        },
        customerPhone: {
            type: STRING(20),
            allowNull: false,
            comment: "客户手机号"
        },
        customerName: {
            type: STRING(20),
            allowNull: false,
            comment: "客户名"
        }
    },{
        freezeTabName:true,
        underscored:true,
		tableName:"customer",
		timestamps:false,
        classMethods:{
            * getList(options){
                return yield this.findAll();
            },
            * add(options){
                if(!options.customerName) return {
                    code: -1,
                    msg: "请输入客户名称"
                }
                if(!options.customerPhone) return {
                    code: -1,
                    msg: "请输入客户手机"
                }
                if(!options.customerPhone) return {
                    code: -1,
                    msg: "请输入目的地"
                }

                yield this.create(options);
                return {
                    code:200,
                    msg:"添加客户成功"
                }
            },
            * remove(options) {
                if(!options.carId) return {
                    code:-1,
                    msg:"缺少车辆主键"
                }
                const result = yield this.destroy({
                    where:{
                        customerId:{
                            $eq:options.customerId
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
        }
    })
}