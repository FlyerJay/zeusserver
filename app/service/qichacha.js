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
        const response = yield request({
          url: 'http://api.qichacha.com/ECICreditCode/GetCreditCodeNew',
          method: 'get',
          params: {
            key: apiKey,
            name: name
          },
          headers: {
            'Token': token,
            'Timespan': timespan
          }
        });
        return response;
      } catch (err) {
        console.log(err);
        return err;
      }
    }
  }
  return Qichacha;
};