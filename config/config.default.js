'use strict';

module.exports = appInfo => {
  return {
    keys: appInfo.name + '_1492401589170_1020',
    security:{
      csrf:{
        ignore:'/upload',
      }
    },
    multipart:{
      fileExtensions:[
        '.xlsx'
      ]
    },
    sequelize:{
      dialect: 'mysql',
      database: 'zues',
      host: '115.29.150.218',
      port: '3306',
      username: 'pro',
      password: '080728',
    }
  }
}
