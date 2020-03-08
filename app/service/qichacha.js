const request = require('axios');
const md5 = require('md5');

module.exports = (app) => {
  class Qichacha extends app.Service {
    generateParams () {
      const timespan = Math.ceil(Date.now() / 1000);
      const apiKey = '0612c76e98bd48f5bb724f000b75bcf8';
      const secret = 'F0E285B52F391FFE81C98CF8339EE422';
      const token = md5(apiKey + timespan + secret).toLocaleUpperCase();

      return {
        timespan,
        apiKey,
        token
      };
    }

    * search (name) {
      const { apiKey, timespan, token } = this.generateParams();
      try {
        const url = encodeURI('http://api.qichacha.com/ECICreditCode/GetCreditCodeNew');
        const response = yield this.ctx.http.get(url,
          {
            key: apiKey,
            keyWord: name
          },
          {
            headers: {
              'Token': token,
              'Timespan': timespan
            }
          }
        );
        return response;
      } catch (err) {
        return err;
      }
    }

    * appendTax (options) {
      if (!options.name) return {
        code: -1,
        msg: '缺少企业名称'
      };
      if (!options.enterpriseId) return {
        code: -1,
        msg: '缺少主键'
      };
      const response = yield this.search(options.name);
      if (response.Status === '200') {
        const data = {
          taxNumber: response.Result.CreditCode,
          addr: response.Result.Address,
          tel: response.Result.Tel,
          bankName: response.Result.Bank,
          bankcardNo: response.Result.BankAccount
        };

        const result = yield app.model.Enterprise.update(data, {
          where: {
            enterpriseId: {
              $eq: options.enterpriseId
            }
          }
        });

        if (result) {
          const findResult = yield app.model.Enterprise.findOne({
            where: {
              enterpriseId: {
                $eq: options.enterpriseId
              }
            }
          });
          return {
            code: 200,
            data: findResult
          };
        } else {
          return {
            code: -1,
            msg: '更新企业信息失败'
          };
        }
      } else {
        return {
          code: -1,
          msg: '查询企业信息失败',
          data: response
        };
      }
    }
  }
  return Qichacha;
};