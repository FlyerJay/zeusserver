/**
 * @author flyerjay
 * 供应商中间表
 * @date 2017-10-16
 */

 "use strict"

 module.exports = app => {
    const { STRING, INTEGER } = app.Sequelize;
    return app.model.define("SupplierRelate",{
        relateId: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            comment: "关联表主键",
        },
        supplierId: {
            type: INTEGER,
            allowNull: false,
            comment: "与供应商表作关联用"
        },
        comId: {
            type: STRING(2),
            primaryKey: true,
            allowNull:false,
            comment: "与公司进行关联",
        },
        isValide: {
            type: INTEGER,
            allowNull: false,
            comment: "是否启用",
        },
        benifitAdjust: {
            type: INTEGER,
            allowNull: true,
            comment: "政策浮动影响"
        },
        benifit: {
            type: INTEGER,
            allowNull: true,
            comment: "厂家优惠"
        }
    },{
        freezeTabName:true,
		tableName:"supplier_relate",
        underscored:true,
		timestamps:false,
    })
 }