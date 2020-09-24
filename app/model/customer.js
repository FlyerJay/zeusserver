/**
 * author:flyerjay
 * 2017-09-10
 * 客户实体类
 */
'use strict';

module.exports = (app) => {
  const { STRING, INTEGER } = app.Sequelize;
  return app.model.define('Customer', {
    customerId: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: '客户编号（主键）'
    },
    destination: {
      type: STRING(20),
      allowNull: false,
      comment: '目的地'
    },
    customerPhone: {
      type: STRING(20),
      allowNull: false,
      comment: '客户手机号'
    },
    customerName: {
      type: STRING(20),
      allowNull: false,
      comment: '客户名'
    }
  }, {
    freezeTabName: true,
    underscored: true,
    tableName: 'customer',
    timestamps: false,
    classMethods: {
      * getList(options) {
        const [$1, $2] = yield [app.model.query(`SELECT * FROM customer WHERE
                customerName LIKE :customerName
                ORDER BY customerId ASC
                LIMIT :start,:offset
                `, {
                  replacements: {
                    start: !options.page ? 0 : (options.page - 1) * (options.pageSize ? options.pageSize : 5),
                    offset: options.pageSize ? options.pageSize : 5,
                    customerName: options.customerName ? `%${options.customerName}%` : '%%'
                  }
                }),
          app.model.query(`SELECT count(1) as count FROM customer WHERE
                customerName LIKE :customerName
                ORDER BY customerId ASC
                `, {
                  replacements: {
                    customerName: options.customerName ? `%${options.customerName}%` : '%%'
                  }
                })];
        if (!$1[0] || $1[0].length === 0) return {
          code: 200,
          msg: '数据为空',
          data: {
            count: 0,
            row: []
          }
        };
        let result = {};
        result.row = $1[0];
        result.totalCount = $2[0][0].count;
        result.page = options.page ? options.page : 0;
        result.pageSize = options.pageSize ? options.pageSize : 5;
        return {
          code: 200,
          data: result,
          msg: '查询成功'
        };
      },
      * add(options) {
        if (!options.customerName) return {
          code: -1,
          msg: '请输入客户名称'
        };
        if (!options.customerPhone) return {
          code: -1,
          msg: '请输入客户手机'
        };
        if (!options.customerPhone) return {
          code: -1,
          msg: '请输入目的地'
        };

        yield this.create(options);
        return {
          code: 200,
          msg: '添加客户成功'
        };
      },
      * remove(options) {
        if (!options.customerId) return {
          code: -1,
          msg: '缺少客户主键'
        };
        const result = yield this.destroy({
          where: {
            customerId: {
              $eq: options.customerId
            }
          }
        });
        if (result) return {
          code: 200,
          msg: '删除成功'
        };
        return {
          code: -1,
          msg: '删除失败'
        };
      }
    }
  });
};