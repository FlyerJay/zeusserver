/**
 * flyerjay
 * 需求数量-重量 统计日报表
 */
'use strict';

module.exports = (app) => {
  const { STRING, INTEGER, DOUBLE, DATE } = app.Sequelize;

  return app.model.define('demandCountDate', {
    demandCountId: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: '主键'
    },
    comId: {
      type: STRING(2),
      comment: '公司编号(关联公司信息)'
    },
    userId: {
      type: STRING(20),
      comment: '业务员'
    },
    count: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '总需求数'
    },
    weight: {
      type: DOUBLE(11, 2),
      allowNull: false,
      defaultValue: 0.00,
      comment: '总需求吨位'
    },
    noOffer: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '未报价需求数'
    },
    noOfferWeight: {
      type: DOUBLE(11, 2),
      allowNull: false,
      defaultValue: 0.00,
      comment: '待反馈需求吨数'
    },
    pendingFeedback: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '待反馈需求数'
    },
    pendingFeedbackWeight: {
      type: DOUBLE(11, 2),
      allowNull: false,
      defaultValue: 0.00,
      comment: '待反馈需求吨数'
    },
    feedback: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '已反馈需求数'
    },
    feedbackWeight: {
      type: DOUBLE(11, 2),
      allowNull: false,
      defaultValue: 0.00,
      comment: '已反馈需求吨数'
    },
    noDeal: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '未成交需求数'
    },
    noDealWeight: {
      type: DOUBLE(11, 2),
      allowNull: false,
      defaultValue: 0.00,
      comment: '未成交需求顿数'
    },
    deal: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '成交需求数'
    },
    dealWeight: {
      type: DOUBLE(11, 2),
      allowNull: false,
      defaultValue: 0.00,
      comment: '成交需求顿数'
    },
    date: {
      type: INTEGER,
      allowNull: false,
      comment: '统计日期 YYYYMMDD'
    },
    createTime: {
      type: DATE,
      allowNull: false,
      comment: '记录创建时间'
    }
  }, {
    freezeTabName: true,
    underscored: true,
    tableName: 'demand_count_date_stat',
    timestamps: false,
    classMethods: {
      * generateData (date, data) {
        return yield app.model.transaction((t) => app.model.DemandCountDateStat.destroy({
          where: {
            date: {
              $eq: date
            }
          },
          transaction: t
        }).then(() => Promise.all(data.map((item) => app.model.DemandCountDateStat.create(Object.assign({}, item, {
          date,
          createTime: new Date()
        }), {transaction: t })))));
      },

      * getDemandCountStat (options) {
        const data = yield app.model.query(`
          SELECT * FROM demand_count_date_stat dcdt
            WHERE (dcdt.userId IN (:userIdArr) OR :userIds = '') 
              AND (dcdt.comId = :comId OR :comId = '')
              AND dcdt.date >= :startDate
              AND dcdt.date <= :endDate
        `, {
          replacements: {
            userIdArr: options.userIds.split(','),
            userIds: options.userIds,
            comId: options.comId,
            startDate: Number(options.startDate),
            endDate: Number(options.endDate || options.startDate)
          }
        });
        return {
          code: 200,
          data: data[0]
        };
      }
    }
  });
};