/**
 * author:flyerjay
 * 2017-04-19
 * 公司实体类
 */
'use strict';
var uuid = require('uuid');

module.exports = app => {
    const { STRING } = app.Sequelize;

    return app.model.define('Company',{
        comId: {
            type: STRING,
            primaryKey: true,
            allowNull:false,
            comment:"公司编号",
        },
        comName: {
            type: STRING,
            allowNull:false,
            comment:"公司名称"
        }
    },{
        freezeTabName:true,
		tableName:"company",
		timestamps:false,
        classMethods:{
            * getList(){
                return yield this.findAll();
            }
        }
    })
}