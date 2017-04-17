'use strict';

module.exports = appInfo => {
  const config = {};

  config.keys = appInfo.name + '_1492401589170_1020';
  config.security = {
    csrf:{
      ignore:'/upload',
    }
  }
  config.multipart = {
    fileExtensions:[
      '.xlsx'
    ]
  }

  return config;
};
