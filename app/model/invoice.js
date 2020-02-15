/**
 * @author flyerjay
 * 2020-02-02
 * 发票信息
 */


module.exports = (app) => {
  const { STRING, INTEGER, BIGINT, DOUBLE } = app.Sequelize;

  return app.model.define('Invoice', {
    invoiceId: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: '发票表主键'
    },
    clientId: {
      type: INTEGER,
      allowNull: false,
      comment: '开票人'
    },
    enterpriseId: {
      type: INTEGER,
      allowNull: false,
      comment: '开票公司'
    },
    invoiceTime: {
      type: BIGINT(15),
      allowNull: false,
      comment: '发票日期'
    },
    startTime: {
      type: BIGINT(15),
      allowNull: false,
      comment: '发票时间段-开始'
    },
    endTime: {
      type: BIGINT(15),
      allowNull: false,
      comment: '发票时间段-结束'
    },
    createTime: {
      type: BIGINT(15),
      allowNull: false,
      comment: '创建时间'
    },
    invoiceAmount: {
      type: DOUBLE(10, 2),
      allowNull: true,
      comment: '发票金额'
    },
    totalAmount: {
      type: DOUBLE(10, 2),
      allowNull: true,
      comment: '累计金额'
    },
    status: {
      type: STRING(10),
      allowNull: false,
      comment: '发票状态: APPLY-申请中, WAIT-处理中, PASSED-通过, REFUSED-拒绝, SEND-邮寄, COMPLETE-完成'
    },
    trackNumber: {
      type: STRING(40),
      allowNull: true,
      comment: '运单号'
    },
    descrption: {
      type: STRING(100),
      allowNull: true,
      comment: '描述'
    },
    feedback: {
      type: STRING(100),
      allowNull: true,
      comment: '反馈'
    }
  }, {
    freezeTabName: true,
    underscored: true,
    tableName: 'invoice',
    timestamps: false,
    classMethods: {
      // 创建发票
      * createOneInvoice (options) {
        try {
          options.createTime = +new Date();
          options.status = 'APPLY';
          const result = yield this.create(options);
          if (result) {
            return {
              code: 200,
              msg: '创建发票成功',
              data: result
            };
          } else {
            throw new Error('出现了一些问题');
          }
        } catch (exp) {
          return {
            code: -1,
            msg: exp || '创建发票失败，请检查字段是否完整'
          };
        }
      },

      * updateInvoice (options) {
        try {
          const result = yield this.update(options, {
            where: {
              invoiceId: {
                $eq: options.invoiceId
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
              msg: '修改发票信息成功'
            };
          }
          throw new Error('修改发票信息失败');
        } catch (exp) {
          return {
            code: -1,
            msg: '修改发票信息失败',
            data: exp
          };
        }
      },

      * updateInvoiceForZues (options) {
        try {
          const result = yield this.update(options, {
            where: {
              invoiceId: {
                $eq: options.invoiceId
              }
            }
          });
          if (result) {
            return {
              code: 200,
              data: result,
              msg: '修改发票信息成功'
            };
          }
          throw new Error('修改发票信息失败');
        } catch (exp) {
          return {
            code: -1,
            msg: '修改发票信息失败',
            data: exp
          };
        }
      },

      // 查询发票列表
      * invoiceList (options) {
        const [$1, $2] = yield [
          app.model.query(`
            SELECT i.*, e.address, e.bankName, e.bankcardNo, e.businessLicense, e.contract, e.enterpriseName, e.invoiceInfo, e.taxNumber, e.telephone, e.auditStatus, e.comId
              FROM invoice i
              INNER JOIN enterprise e
                ON e.enterpriseId = i.enterpriseId
                AND e.enterpriseName LIKE :enterpriseName
              INNER JOIN company c
                ON c.comId = e.comId
              WHERE (i.clientId = :clientId OR :clientId = '')
                AND (i.enterpriseId = :enterpriseId OR :enterpriseId = '')
                AND i.status IN (:status)
                AND (c.comId = :comId OR :comId = '' OR :comId = '00')
              ORDER BY FIELD(i.status, 'APPLY', 'SEND', 'WAIT', 'PASSED', 'REFUSED', 'COMPLETE'), i.createTime DESC
              LIMIT :start,:offset`, {
                replacements: {
                  clientId: options.clientId || '',
                  enterpriseId: options.enterpriseId || '',
                  enterpriseName: options.enterpriseName ? `%${options.enterpriseName}%` : '%%',
                  status: options.status ? options.status === 'U' ? ['APPLY', 'WAIT'] : ['SEND', 'PASSED', 'REFUSE', 'COMPLETE'] : ['APPLY', 'WAIT', 'SEND', 'PASSED', 'REFUSE', 'COMPLETE'],
                  comId: options.comId || '',
                  start: !options.page ? 0 : (options.page - 1) * (options.pageSize ? options.pageSize : 15),
                  offset: options.pageSize ? Number(options.pageSize) : 15
                }
              }),
          app.model.query(`
            SELECT count(1) AS count
              FROM invoice i
              INNER JOIN enterprise e
                ON e.enterpriseId = i.enterpriseId
                AND e.enterpriseName LIKE :enterpriseName
              INNER JOIN company c
                ON c.comId = e.comId
              WHERE (i.clientId = :clientId OR :clientId = '')
                AND (i.enterpriseId = :enterpriseId OR :enterpriseId = '')
                AND i.status IN (:status)
                AND (c.comId = :comId OR :comId = '' OR :comId = '00')`,
            {
              replacements: {
                clientId: options.clientId || '',
                enterpriseId: options.enterpriseId || '',
                enterpriseName: options.enterpriseName ? `%${options.enterpriseName}%` : '%%',
                status: options.status ? options.status === 'U' ? ['APPLY', 'WAIT'] : ['SEND', 'PASSED', 'REFUSE', 'COMPLETE'] : ['APPLY', 'WAIT', 'SEND', 'PASSED', 'REFUSE', 'COMPLETE'],
                comId: options.comId || ''
              }
            })];
        if (!$1[0] || $1[0].length === 0) return {
          code: 200,
          msg: '发票列表为空',
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
          msg: '查找发票列表成功',
          data: result
        };
      },

      * invoiceInfo (options) {
        if (!options.invoiceId) return {
          code: -1,
          msg: '请完善查询条件'
        };
        const result = yield app.model.query(`
        SELECT i.*, e.address, e.bankName, e.bankcardNo, e.businessLicense, e.contract, e.enterpriseName, e.invoiceInfo, e.taxNumber, e.telephone, e.auditStatus, e.comId, c.comName, c.externalName
          FROM invoice i
          INNER JOIN enterprise e
            ON e.enterpriseId = i.enterpriseId
          INNER JOIN company c
            ON c.comId = e.comId
          WHERE i.invoiceId = :invoiceId
            AND i.clientId = :clientId
        `, {
          replacements: {
            invoiceId: options.invoiceId,
            clientId: options.clientId
          }
        });
        if (result && result[0] && result[0][0]) {
          return {
            code: 200,
            data: result[0][0],
            msg: '查询成功'
          };
        } else {
          return {
            code: -1,
            data: result,
            msg: '没有找到该发票'
          };
        }
      }
    }
  });
};
