'use strict';

module.exports = app => {
    const { STRING, INTEGER, DATE } = app.Sequelize;

    return app.model.define('User',{
        userToken: {
            type: STRING,
            comment:"验证用户登录的凭证"
        },
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
        password: {
            type: STRING,
            allowNull:false,
            comment:"密码"
        },
        userName: {
            type: STRING,
            comment:"用户名(昵称)"
        },
        registerTime: {
            type: DATE,
            comment:"注册时间"
        },
        lastLoginTime: {
            type: DATE,
            comment:"上次登录时间"
        }
    },{
        freezeTabName:true,
		tableName:"user_info",
		timestamps:false,
        classMethods:{
            * registeUser(options){
                return yield this.create(options);
            },
            * userLogin(options){
                return yield this.findOne(options);
            }
        }
    })
}