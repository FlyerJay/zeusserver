/**
 * 数据统计服务
 */
'use strict';
const moment = require('moment');

module.exports = (app) => {
  class Statistics extends app.Service {
    * demandCountDate () {
      const date = moment(new Date().getTime() - 24 * 1000 * 60 * 60).format('YYYY-MM-DD');
      const data = yield app.model.Demand.getSellerDataByDate(date);
      var statis = {};
      data.forEach((item) => {
        if (!statis[item.userId + '_' + item.comId]) {
          statis[item.userId + '_' + item.comId] = {};
        }
        statis[item.userId + '_' + item.comId].userId = item.userId;
        statis[item.userId + '_' + item.comId].comId = item.comId;
        switch (item.state) {
          case 0:
            statis[item.userId + '_' + item.comId].noOffer = item.count || 0;
            statis[item.userId + '_' + item.comId].noOfferWeight = item.weight || 0.00;
            break;
          case 1:
            statis[item.userId + '_' + item.comId].pendingFeedback = item.count || 0;
            statis[item.userId + '_' + item.comId].pendingFeedbackWeight = item.weight || 0.00;
            break;
          case 2:
            statis[item.userId + '_' + item.comId].feedback = item.count || 0;
            statis[item.userId + '_' + item.comId].feedbackWeight = item.weight || 0.00;
            break;
          case 3:
            statis[item.userId + '_' + item.comId].noDeal = item.count || 0;
            statis[item.userId + '_' + item.comId].noDealWeight = item.weight || 0.00;
            break;
          case 4:
            statis[item.userId + '_' + item.comId].deal = item.count || 0;
            statis[item.userId + '_' + item.comId].dealWeight = item.weight || 0.00;
            break;
          default:
            break;
        }
      });
      var insertData = [];
      Object.keys(statis).forEach((key) => {
        const item = statis[key];
        const noOffer = item.noOffer || 0;
        const noOfferWeight = item.noOfferWeight || 0;
        const pendingFeedback = item.pendingFeedback || 0;
        const pendingFeedbackWeight = item.pendingFeedbackWeight || 0;
        const feedback = item.feedback || 0;
        const feedbackWeight = item.feedbackWeight || 0;
        const noDeal = item.noDeal || 0;
        const noDealWeight = item.noDealWeight || 0;
        const deal = item.deal || 0;
        const dealWeight = item.dealWeight || 0;
        insertData.push({
          comId: item.comId,
          userId: item.userId,
          noOffer,
          noOfferWeight,
          pendingFeedback,
          pendingFeedbackWeight,
          feedback,
          feedbackWeight,
          noDeal,
          noDealWeight,
          deal,
          dealWeight,
          count: noOffer + pendingFeedback + feedback + noDeal + deal,
          weight: Number((noOfferWeight + pendingFeedbackWeight + feedbackWeight + noDealWeight + dealWeight).toFixed(2))
        });
      });
      return yield app.model.DemandCountDateStat.generateData(date, insertData);
    }
  }

  return Statistics;
};