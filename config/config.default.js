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
    }
  }
}
