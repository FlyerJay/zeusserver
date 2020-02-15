/**
 * @author flyerjay
 * 2020-02-01
 * 客户信息实体类
 */
'use strict';

var request = require('superagent');

module.exports = (app) => {
  const { STRING, INTEGER } = app.Sequelize;

  return app.model.define('Client', {
    clientId: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: '客户表主键'
    },
    enterpriseId: {
      type: INTEGER,
      allowNull: true,
      comment: '绑定企业ID'
    },
    nickName: {
      type: STRING(30),
      allowNull: true,
      comment: '微信昵称'
    },
    realName: {
      type: STRING(15),
      allowNull: true,
      comment: '真实姓名'
    },
    mobileNumber: {
      type: STRING(11),
      allowNull: true,
      comment: '手机号码'
    },
    avatarUrl: {
      type: STRING(150),
      allowNull: true,
      comment: '微信头像'
    },
    gender: {
      type: STRING(1),
      allowNull: true,
      comment: '性别'
    },
    language: {
      type: STRING(5),
      allowNull: true,
      comment: '所用语言'
    },
    openID: {
      type: STRING(64),
      allowNull: true,
      comment: '微信openID'
    },
    unionID: {
      type: STRING(64),
      allowNull: true,
      comment: '微信unionID'
    },
    address: {
      type: STRING(50),
      allowNull: true,
      comment: '用户所在地'
    }
  }, {
    freezeTabName: true,
    underscored: true,
    tableName: 'client',
    timestamps: false,
    classMethods: {
      * createOneUser (options) {
        return yield this.create(options);
      },

      // 微信授权登录
      * authLogin (options) {
        console.log('参数看看是什么？');
        console.log(options);
        const response = yield this.code2Session(options.code);
        if (response.statusCode === 200) {
          const info = JSON.parse(response.text);
          let result = yield this.findOne({
            where: {
              openID: {
                $eq: info.openid
              }
            },
            attributes: ['clientId', 'nickName', 'realName', 'mobileNumber', 'avatarUrl', 'gender', 'language', 'address', 'enterpriseId']
          });
          if (!result) {
            result = yield this.createOneUser({
              openID: info.openid,
              nickName: options.code.substring(0, 8),
              avatarUrl: 'https://zeuskx-mina-prod.oss-cn-beijing.aliyuncs.com/avatar_default.jpeg'
            });
            result = yield this.findOne({
              where: {
                openID: {
                  $eq: info.openid
                }
              },
              attributes: ['clientId', 'nickName', 'realName', 'mobileNumber', 'avatarUrl', 'gender', 'language', 'address', 'enterpriseId']
            });
          }
          const data = Object.assign({}, result.dataValues);
          return {
            code: 200,
            data: data,
            msg: '登录成功'
          };
        } else {
          return {
            code: -1,
            msg: '获取登录授权失败'
          };
        }
      },

      // 更新用户微信信息
      * updateWechat (options) {
        const response = yield this.update({
          avatarUrl: options.avatarUrl,
          gender: options.gender || '',
          nickName: options.nickName || '',
          language: options.language || '',
          address: `${options.country ? options.country + ' ' : '' }${options.province ? options.province + ' ' : '' }${options.city ? options.city + ' ' : '' }`
        });
        if (response) {
          return {
            code: 200,
            data: response,
            msg: '更新微信信息成功'
          };
        } else {
          return {
            code: -1,
            msg: '更新微信信息失败'
          };
        }
      },

      * userInfo (options) {
        try {
          let result = yield this.findOne({
            where: {
              clientId: {
                $eq: options.clientId
              }
            },
            attributes: ['clientId', 'nickName', 'realName', 'mobileNumber', 'avatarUrl', 'gender', 'language', 'address', 'enterpriseId']
          });
          let enterpriseInfo = {
            enterpriseId: '',
            enterpriseName: '',
            address: '',
            businessLicense: '',
            invoiceInfo: '',
            contract: '',
            telephone: '',
            taxNumber: '',
            bankName: '',
            bankcardNo: ''
          };
          if (result.enterpriseId) {
            const _enterpriseInfo = yield app.model.Enterprise.findOne({
              where: {
                enterpriseId: {
                  $eq: result.enterpriseId
                }
              }
            });
            enterpriseInfo = Object.assign({}, enterpriseInfo, _enterpriseInfo ? _enterpriseInfo.dataValues : {});
          }
          const data = Object.assign({}, result.dataValues, { enterpriseInfo: enterpriseInfo });
          return {
            code: 200,
            data: data,
            msg: '查询用户信息成功'
          };
        } catch (exp) {
          return {
            code: -1,
            data: exp,
            msg: '查询的用户不存在'
          };
        }
      },

      * code2Session (code) {
        const appId = 'wxc86dc970d5b4aa32';
        const appKey = '1b4bdda8982d2836c10b979985730824';
        if (!code) return {
          code: -1,
          msg: '缺少必要参数'
        };
        const grantType = 'authorization_code';
        return yield request.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appKey}&js_code=${code}&grant_type=${grantType}`);
      }
    }
  });
};