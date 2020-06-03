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
          SELECT dcdt.comId, dcdt.userId, SUM(dcdt.count) as count, SUM(dcdt.weight) as weight, SUM(dcdt.noOffer) as noOffer,
            SUM(dcdt.noOfferWeight) as noOfferWeight, SUM(dcdt.pendingFeedback) as pendingFeedback,
            SUM(dcdt.feedback) as feedback, SUM(dcdt.feedbackWeight) as feedbackWeight, SUM(dcdt.noDeal) as noDeal,
            SUM(dcdt.noDealWeight) as noDealWeight, SUM(dcdt.deal) as deal, SUM(dcdt.dealWeight) as dealWeight, dcdt.date, dcdt.createTime
            FROM demand_count_date_stat dcdt
            WHERE (dcdt.userId IN (:userIdArr) OR :userIds = '') 
              AND (dcdt.comId = :comId OR :comId = '')
              AND dcdt.date >= :startDate
              AND dcdt.date <= :endDate
              GROUP BY dcdt.comId, dcdt.userId
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
      },

      * getSpecCount (options) {
        const stateMapping = {
          'COUNT': '',
          'COUNT_UNDEAL': '3',
          'COUNT_DEAL': '4'
        };
        console.log(options.type);
        console.log(stateMapping[options.type]);
        const data = yield app.model.query(`
          SELECT dd.spec, dd.type, count(dd.spec) as count, SUM(dd.demandWeight) as weight, d.comId FROM demand d
          INNER JOIN demand_detail dd
            ON dd.demandNo = d.demandNo
          WHERE d.createTime >= :startDate
            AND d.createTime <= :endDate
            AND (d.comId = :comId OR :comId = '')
            AND (d.state = :state OR :state = '')
            GROUP BY dd.spec, dd.type
            ORDER BY count(dd.spec) DESC
            LIMIT 20;
        `, {
          replacements: {
            comId: options.comId,
            startDate: new Date(options.startDate).getTime(),
            endDate: new Date(options.endDate).getTime(),
            state: stateMapping[options.type]
          }
        });

        return {
          code: 200,
          data: data[0]
        };
      },

      * getSpecWeight (options) {
        const stateMapping = {
          'WEIGHT': '',
          'COUNT_UNDEAL': '3',
          'WEIGHT_UNDEAL': '3',
          'WEIGHT_DEAL': '4'
        };
        console.log(options.type);
        console.log(stateMapping[options.type]);
        const data = yield app.model.query(`
          SELECT dd.spec, dd.type, count(dd.spec) as count, SUM(dd.demandWeight) as weight, d.comId FROM demand d
          INNER JOIN demand_detail dd
            ON dd.demandNo = d.demandNo
          WHERE d.createTime >= :startDate
            AND d.createTime <= :endDate
            AND (d.comId = :comId OR :comId = '')
            AND (d.state = :state OR :state = '')
            GROUP BY dd.spec, dd.type
            ORDER BY SUM(dd.demandWeight) DESC
            LIMIT 20;
        `, {
          replacements: {
            comId: options.comId,
            startDate: new Date(options.startDate + ' 00:00:00').getTime(),
            endDate: new Date(options.endDate + ' 23:59:59').getTime(),
            state: stateMapping[options.type]
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