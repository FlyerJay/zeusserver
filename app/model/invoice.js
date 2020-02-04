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
    timestamps: false
  });
};
