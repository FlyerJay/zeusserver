'use strict';

var path = require("path");
module.exports = appInfo => {
  return {
    keys: appInfo.name + '_1492401589170_1020',
    security:{
      csrf:{
        enable: false,
      }
    },
    multipart:{
      fileExtensions: ['.xlsx','.xls'],
    },
    sequelize:{
      dialect: 'mysql',
      database: 'zues',
      host: '115.29.150.218',
      port: '3306',
      username: 'pro',
      password: '080728',
    },
    io:{//socket.io配置
      namespace:{
        '/':{
          connectionMiddleware:[],
          packetMiddleware:[],
        },
        '/demand':{
          connectionMiddleware:[],
          packetMiddleware:[],
        }
      }
    },
    proxyworker:{
      port: 10086,
    },
    static:{
      prefix: '/public/',
      dir: path.join(appInfo.baseDir, 'app/public'),
      dynamic: true,
      preload: false,
      buffer: false,
    }
  }
}

