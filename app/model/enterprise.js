/**
 * @author flyerjay
 * 2020-02-02
 * 外部公司信息
 */
'use strict';

module.exports = (app) => {
  const { STRING, INTEGER, BIGINT } = app.Sequelize;

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
    comId: {
      type: STRING(2),
      allowNull: false,
      comment: '绑定的开票主体'
    },
    enterpriseName: {
      type: STRING(30),
      allowNull: true,
      comment: '企业名称'
    },
    auditStatus: {
      type: STRING(2),
      allowNull: true,
      comment: '企业审核状态, U - 未审核 P - 已审核 D - 已删除'
    },
    address: {
      type: STRING(50),
      allowNull: true,
      comment: '企业所在地(邮寄地址)'
    },
    addr: {
      type: STRING(50),
      allowNull: true,
      comment: '企业注册地址'
    },
    businessLicense: {
      type: STRING(100),
      allowNull: true,
      comment: '营业执照'
    },
    invoiceInfo: {
      type: STRING(100),
      allowNull: true,
      comment: '开票资料'
    },
    contract: {
      type: STRING(100),
      allowNull: true,
      comment: '购销合同'
    },
    telephone: {
      type: STRING(15),
      allowNull: true,
      comment: '联系人电话'
    },
    tel: {
      type: STRING(25),
      allowNull: true,
      comment: '企业电话'
    },
    taxNumber: {
      type: STRING(20),
      allowNull: true,
      comment: '企业税号'
    },
    bankName: {
      type: STRING(30),
      allowNull: true,
      comment: '开户银行'
    },
    refuseReason: {
      type: STRING(100),
      allowNull: true,
      comment: '拒绝原因'
    },
    bankcardNo: {
      type: STRING(40),
      allowNull: true,
      comment: '对公账户'
    },
    createTime: {
      type: BIGINT(15),
      comment: '创建时间',
      allowNull: false
    }
  }, {
    freezeTabName: true,
    underscored: true,
    tableName: 'enterprise',
    timestamps: false,
    classMethods: {
      // 添加一个企业
      * createOneEnt (options) {
        const response = yield this.findOne({
          where: {
            clientId: {
              $eq: options.clientId
            },
            auditStatus: {
              $eq: 'U'
            }
          }
        });
        if (response) return {
          code: -1,
          msg: '您有正在审核中的抬头信息'
        };
        options.auditStatus = options.auditStatus || 'U';
        if (!options.enterpriseName) options.enterpriseName = '未命名';
        options.createTime = Date.now();
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

      * queryEnt (options) {
        const result = yield app.model.query(`
          SELECT e.*, c.comId, c.comName, c.externalName FROM enterprise e
            INNER JOIN company c
              ON c.comId = e.comId
            WHERE e.enterpriseId = :enterpriseId
        `, {
          replacements: {
            enterpriseId: options.enterpriseId || ''
          }
        });
        if (result && result[0] && result[0][0]) {
          return {
            code: 200,
            data: result[0][0],
            msg: '查询企业信息成功'
          };
        } else {
          return {
            code: -1,
            msg: '查询企业信息失败'
          };
        }
      },

      * removeEnt (options) {
        try {
          const result = yield this.update(
            {
              auditStatus: 'D'
            },
            {
              where: {
                enterpriseId: {
                  $eq: options.enterpriseId
                },
                clientId: {
                  $eq: options.clientId
                }
              }
            });
          if (result) {
            return {
              code: 200,
              data: result,
              msg: '删除抬头成功'
            };
          } else {
            return {
              code: -1,
              data: result,
              msg: '删除抬头成功'
            };
          }
        } catch (exp) {
          return {
            code: -1,
            msg: '删除抬头成功'
          };
        }
      },

      * authEnt (options) {
        options.auditStatus = 'P';
        try {
          const result = yield this.update(options, {
            where: {
              enterpriseId: {
                $eq: options.enterpriseId
              }
            }
          });
          if (result) {
            return {
              code: 200,
              data: result,
              msg: '企业认证成功'
            };
          }
          throw new Error('出现意外情况');
        } catch (exp) {
          return {
            code: -1,
            msg: '企业认证失败',
            data: exp
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
        const result = yield app.model.query(`
          SELECT DISTINCT(e.enterpriseName), e.* FROM enterprise e
            WHERE e.enterpriseName = :enterpriseName
              AND (e.comId = :comId OR :comId = '')
              AND e.auditStatus = 'P'
            LIMIT 5
        `, {
          replacements: {
            enterpriseName: options.enterpriseName || '',
            comId: options.comId || ''
          }
        });
        return {
          code: 200,
          data: result[0] ? result[0] : []
        };
      },

      * entList (options) {
        const orderRule = options.clientId;
        const [$1, $2] = yield [app.model.query(
          `SELECT e.*, c.comName, c.externalName FROM enterprise e
              INNER JOIN company c
              ON c.comId = e.comId
            WHERE (e.clientId = :clientId OR :clientId = '')
              AND enterpriseName LIKE :enterpriseName
              AND (auditStatus = :auditStatus OR :auditStatus = '')
              AND auditStatus <> 'D'
              AND (c.comId = :comId OR :comId = '')
              ORDER BY FIELD(e.auditStatus, :orderBy), e.createTime DESC
              LIMIT :start,:offset`,
          {
            replacements: {
              clientId: options.clientId || '',
              enterpriseName: options.enterpriseName ? `%${options.enterpriseName}%` : '%%',
              auditStatus: options.auditStatus || '',
              start: !options.page ? 0 : (options.page - 1) * (options.pageSize ? options.pageSize : 15),
              offset: options.pageSize ? Number(options.pageSize) : 15,
              comId: options.comId || '',
              orderBy: orderRule ? 'P, U' : 'U, P'
            }
          }
        ), app.model.query(
          `SELECT count(1) as count FROM enterprise e
            INNER JOIN company c
              ON c.comId = e.comId
            WHERE (e.clientId = :clientId OR :clientId = '')
              AND enterpriseName LIKE :enterpriseName
              AND (auditStatus = :auditStatus OR :auditStatus = '')
              AND auditStatus <> 'D'
              AND (c.comId = :comId OR :comId = '')`,
          {
            replacements: {
              clientId: options.clientId || '',
              enterpriseName: options.enterpriseName ? `%${options.enterpriseName}%` : '%%',
              auditStatus: options.auditStatus || '',
              comId: options.comId || ''
            }
          }
        )];

        if (!$1[0] || $1[0].length === 0) return {
          code: 200,
          msg: '企业列表为空',
          data: {
            count: 0,
            row: []
          }
        };
        let result = {};
        result.row = $1[0];
        result.totalCount = $2[0][0].count;
        result.page = options.page ? options.page : 0;
        result.pageSize = options.pageSize ? options.pageSize : 15;
        return {
          code: 200,
          msg: '查找企业列表成功',
          data: result
        };
      },

      * companyList () {
        const result = yield app.model.Company.findAll({
          where: {
            comId: {
              $ne: '00'
            }
          },
          limit: 100
        });
        if (result) {
          return {
            code: 200,
            data: result,
            msg: '获取开票主体列表成功'
          };
        } else {
          return {
            code: -1,
            data: result,
            msg: '获取开票主体失败'
          };
        }
      }
    }
  });
};