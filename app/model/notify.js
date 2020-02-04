/**
 * author:flyerjay
 * 2017-09-04
 * 通知类实体
 */
'use strict';

module.exports = (app) => {
  const { STRING, INTEGER, BIGINT} = app.Sequelize;

  return app.model.define('Notify', {
    notifyId: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: '通知主键'
    },
    type: {
      type: INTEGER,
      allowNull: false,
      comment: '通知类型'
    },
    content: {
      type: STRING(50),
      allowNull: false,
      comment: '通知内容'
    },
    perAmount: {
      type: INTEGER,
      allowNull: false,
      default: 0,
      comment: '单件支数'
    },
    demandWeight: {
      type: STRING(20),
      allowNull: true,
      comment: '需求重量'
    },
    factoryPrice: {
      type: INTEGER(11),
      comment: '出厂价'
    },
    feedbackPrice: {
      type: INTEGER(11),
      comment: '需求报价'
    },
    freight: {
      type: INTEGER(11),
      comment: '运费'
    },
    comment: {
      type: STRING(50),
      allowNull: true,
      comment: '需求备注'
    }
  }, {
    freezeTabName: true,
    underscored: true,
    tableName: 'demand_detail',
    timestamps: false,
    classMethods: {
    }
  });
};