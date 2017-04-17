'use strict';

module.exports = app => {
    const { STRING, INTEGER, DATE } = app.Sequelize;

    return app.model.define('user',{
        userToken: {
            type: STRING,
        },
        userId: {
            type: STRING,
        },
        comId: {
            type: STRING,
        },
        password: {
            type: STRING,
        },
        userName: {
            type: STRING,
        },
        registerTime: {
            type: DATE,
        },
        lastLoginTime: {
            type: DATE,
        }
    })
}