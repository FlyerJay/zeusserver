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
          const client = yield app.model.Client.findOne({
            where: {
              clientId: {
                $eq: options.clientId
              }
            }
          });
          if (!client.enterpriseId) throw new Error('用户未绑定企业');
          options.enterpriseId = client.enterpriseId;
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

      // 查找发票列表
      * invoiceList (options) {
        const [$1, $2] = yield [
          app.model.query(`
            SELECT i.*, e.address, e.bankName, e.bankcardNo, e.businessLicense, e.contract, e.enterpriseName, e.invoiceInfo, e.taxNumber, e.telephone
              FROM invoice i
              INNER JOIN enterprise e
                ON e.enterpriseId = i.enterpriseId
                AND e.enterpriseName LIKE :enterpriseName
              WHERE (i.clientId = :clientId OR :clientId = '')
              AND (i.enterpriseId = :enterpriseId OR :enterprise = '')
              ORDER BY FIELD(i.status, 'WAIT', 'SEND', 'APPLY', 'PASSED', 'REFUSED', 'COMPLETE'), i.createTime DESC
              LIMIT :start,:offset`, {
                replacements: {
                  clientId: options.clientId || '',
                  enterpriseId: options.enterpriseId || '',
                  enterpriseName: options.enterpriseName ? `%${options.enterpriseName}%` : '%%',
                  start: !options.page ? 0 : (options.page - 1) * (options.pageSize ? options.pageSize : 15),
                  offset: options.pageSize ? options.pageSize : 15
                }
              }),
          app.model.query(`
            SELECT count(1) AS count
              FROM invoice i
              INNER JOIN enterprise e
                ON e.enterpriseId = i.enterpriseId
                AND e.enterpriseName LIKE :enterpriseName
              WHERE (i.clientId = :clientId OR :clientId = '')
              AND (i.enterpriseId = :enterpriseId OR :enterprise = '')`, {
                replacements: {
                  clientId: options.clientId || '',
                  enterpriseId: options.enterpriseId || '',
                  enterpriseName: options.enterpriseName ? `%${options.enterpriseName}%` : '%%'
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
      }
    }
  });
};
