/**
 * author:flyerjay
 * 2017-04-19
 * 公司实体类
 */
'use strict';

module.exports = (app) => {
  const { STRING } = app.Sequelize;

  return app.model.define('Company', {
    comId: {
      type: STRING(2),
      primaryKey: true,
      allowNull: false,
      comment: '公司编号'
    },
    comName: {
      type: STRING(20),
      allowNull: false,
      comment: '公司名称'
    },
    externalName: {
      type: STRING(30),
      allowNull: true,
      comment: '公司对外的名字'
    }
  }, {
    freezeTabName: true,
    underscored: true,
    tableName: 'company',
    timestamps: false,
    classMethods: {
      * getList () {
        return yield this.findAll();
      }
    }
  });
};