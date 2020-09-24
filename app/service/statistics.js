/**
 * 数据统计服务
 */
'use strict';
const moment = require('moment');

module.exports = (app) => {
  class Statistics extends app.Service {
    * demandCountDate () {
      var date = moment(new Date().getTime() - 24 * 1000 * 60 * 60).format('YYYYMMDD');
      date = Number(date);
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

    * batchCountData () {
      var sourceDate = new Date('2018-01-01');
      var date = moment(sourceDate).format('YYYYMMDD');
      date = Number(date);
      while (date < 20200527) {
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
        yield app.model.DemandCountDateStat.generateData(date, insertData);
        sourceDate = new Date(sourceDate.getTime() + 24 * 60 * 60 * 1000);
        date = moment(sourceDate).format('YYYYMMDD');
        date = Number(date);
      }
    }
  }

  return Statistics;
};