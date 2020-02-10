/**
 * @author flyerjay
 * 2020-02-02
 * 外部公司信息
 */
'use strict';

module.exports = (app) => {
  const { STRING, INTEGER } = app.Sequelize;

  return app.model.define('Enterprise', {
    enterpriseId: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: '企业表主键'
    },
    clientId: {
      type: INTEGER,
      allowNull: false,
      comment: '创建者，只有这个人可以修改公司信息'
    },
    enterpriseName: {
      type: STRING(30),
      allowNull: true,
      comment: '企业名称'
    },
    auditStatus: {
      type: STRING(2),
      allowNull: true,
      comment: '企业审核状态, U - 未审核 P - 已审核'
    },
    address: {
      type: STRING(50),
      allowNull: true,
      comment: '企业所在地(邮寄地址)'
    },
    businessLicense: {
      type: STRING(30),
      allowNull: true,
      comment: '营业执照'
    },
    invoiceInfo: {
      type: STRING(30),
      allowNull: true,
      comment: '开票资料'
    },
    contract: {
      type: STRING(30),
      allowNull: true,
      comment: '购销合同'
    },
    telephone: {
      type: STRING(15),
      allowNull: true,
      comment: '企业电话'
    },
    taxNumber: {
      type: STRING(15),
      allowNull: true,
      comment: '企业税号'
    },
    bankName: {
      type: STRING(30),
      allowNull: true,
      comment: '开户银行'
    },
    bankcardNo: {
      type: STRING(40),
      allowNull: true,
      comment: '对公账户'
    }
  }, {
    freezeTabName: true,
    underscored: true,
    tableName: 'enterprise',
    timestamps: false,
    classMethods: {
      // 添加一个企业
      * createOneEnt (options) {
        if (!options.enterpriseName) options.enterpriseName = '未命名';
        const createResult = yield this.create(options);
        if (createResult) {
          try {
            const findResult = yield app.model.Client.findOne({
              where: {
                clientId: {
                  $eq: options.clientId
                }
              }
            });
            findResult.enterpriseId = createResult.enterpriseId;
            yield findResult.save();
            return {
              code: 200,
              data: createResult,
              msg: '创建企业成功'
            };
          } catch (exp) {
            return {
              code: 200,
              data: createResult,
              msg: '创建企业成功，但未能成功绑定'
            };
          }
        } else {
          return {
            code: -1,
            msg: '创建企业失败'
          };
        }
      },

      * updateEnt (options) {
        try {
          const result = yield this.update(options, {
            where: {
              clientId: {
                $eq: options.clientId
              },
              enterpriseId: {
                $eq: options.enterpriseId
              }
            }
          });
          if (result) {
            return {
              code: 200,
              data: result,
              msg: '更新企业信息成功'
            };
          } else {
            return {
              code: -1,
              msg: '你不是该企业创建者，不能更改该企业信息'
            };
          }
        } catch (exp) {
          return {
            code: -1,
            msg: '更新企业信息失败'
          };
        }
      },

      * changeBind (options) {
        try {
          const result = yield app.model.Client.update({
            enterpriseId: options.enterpriseId
          }, {
            where: {
              clientId: {
                $eq: options.clientId
              }
            }
          });
          if (result) {
            return {
              code: 200,
              data: result,
              msg: '换绑企业成功'
            };
          }
        } catch (exp) {
          return {
            code: -1,
            msg: '换绑企业失败'
          };
        }
      },

      * matchList (options) {
        const result = yield this.findAll({
          where: {
            enterpriseName: {
              $like: `%${options.enterpriseName}%`
            }
          },
          limit: 5
        });
        return result.rows;
      }
    }
  });
};