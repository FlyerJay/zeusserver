'use strict';

var path = require('path');
module.exports = (appInfo) => ({
  keys: appInfo.name + '_1492401589170_1020',
  security: {
    csrf: {
      enable: false
    }
  },
  multipart: {
    fileExtensions: ['.xlsx', '.xls']
  },
  sequelize: {
    dialect: 'mysql',
    database: 'zues',
    host: '116.62.226.140',
    port: '3306',
    username: 'zues',
    password: 'zues@Kx002'
  },
  io: {// socket.io配置
    namespace: {
      '/socket/': {
        connectionMiddleware: [],
        packetMiddleware: []
      }
    },
    redis: {
      host: '116.62.226.140',
      port: 6379,
      'auth_pass': 'zeuskx001',
      db: 0
    }
  },
  proxyworker: {
    port: 10086
  },
  static: {
    prefix: '/public/',
    dir: path.join(appInfo.baseDir, 'app/public'),
    dynamic: true,
    preload: false,
    buffer: false
  }
});

