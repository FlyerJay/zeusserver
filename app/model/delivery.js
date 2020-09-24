/**
 * author:flyerjay
 * 2020-06-10
 * 快递公司设置
 */
'use strict';

module.exports = (app) => {
  const { STRING, INTEGER } = app.Sequelize;
  return app.model.define('Delivery', {
    recordId: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: '记录Id'
    },
    recordName: {
      type: STRING(20),
      allowNull: false,
      comment: '记录名称'
    },
    comId: {
      type: STRING(2),
      comment: '公司编号(关联公司信息)'
    },
    deliveryId: {
      type: STRING(10),
      allowNull: false,
      comment: '快递公司Id'
    },
    deliveryName: {
      type: STRING(10),
      allowNull: false,
      comment: '快递公司名称'
    },
    bizId: {
      type: STRING(20),
      allowNull: false,
      comment: '月结编号'
    },
    senderName: {
      type: STRING(10),
      allowNull: false,
      comment: '发件人姓名'
    },
    senderTel: {
      type: STRING(15),
      allowNull: false,
      comment: '发件人座机'
    },
    senderMobile: {
      type: STRING(11),
      allowNull: false,
      comment: '发件人手机号'
    },
    senderCompany: {
      type: STRING(20),
      allowNull: false,
      comment: '发件人公司'
    },
    senderPostCode: {
      type: STRING(8),
      allowNull: false,
      comment: '发件人邮编'
    },
    senderProvince: {
      type: STRING(10),
      allowNull: false,
      comment: '省份'
    },
    senderCity: {
      type: STRING(10),
      allowNull: false,
      comment: '城市'
    },
    senderArea: {
      type: STRING(10),
      allowNull: false,
      comment: '地区'
    },
    senderAddress: {
      type: STRING(10),
      allowNull: false,
      comment: '详细地址'
    },
    serviceType: {
      type: INTEGER(2),
      allowNull: false,
      comment: '服务类型'
    },
    serviceName: {
      type: INTEGER(2),
      allowNull: false,
      comment: '服务名称'
    }
  }, {
    freezeTabName: true,
    underscored: true,
    tableName: 'delivery',
    timestamps: false,
    classMethods: {

    }
  });
};