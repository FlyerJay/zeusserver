const appId = 'wxafd228a814c32317';
const appKey = 'ead3d64c4b07b5ce4cde10b5dfe1b823';

module.exports = (app) => {
  class Express extends app.Service {
    * getTokenRequest () {
      const response = yield this.ctx.http.get('https://api.weixin.qq.com/cgi-bin/token', {
        'grant_type': 'client_credential',
        'appid': appId,
        'secret': appKey
      });
      if (response && response.access_token) {
        return response.access_token;
      }
      return '';
    }

    * updateAccessToken () {
      const accessToken = yield this.getTokenRequest();
      if (accessToken) {
        this.app.redis.set('access_token', accessToken);
      }
    }

    // 因为token是每小时更新一次，所以先尝试从缓存中取
    * getAccessToken () {
      const accessToken = yield this.app.redis.get('access_token');
      if (accessToken) {
        return accessToken;
      }
      return yield this.getTokenRequest();
    }

    // 物流下单接口
    * createOrder (params) {
      const accessToken = yield this.getAccessToken();
      const data = {
        'access_token': accessToken,
        'add_source': params.addSource || 0,
        'wx_appid': params.appId || '',
        'order_id': params.orderId, // 订单编号
        'openid': params.openId, // 用户openId
        'delivery_id': params.deliveryId, // 快递公司
        'biz_id': params.bizId,
        'custom_remark': params.customRemark || '', // 添加备注
        'tagid': params.tagId || '', // 平台小程序入驻方账号
        'sender': {
          'name': params.senderName || '', // 发件人姓名
          'tel': params.senderTel || '', // 发件人座机
          'mobile': params.senderMobile || '', // 发件人手机号
          'company': params.senderCompany || '', // 发件人公司
          'post_code': params.senderPostCode || '', // 发件人邮编
          'province': params.senderProvince,
          'city': params.senderCity,
          'area': params.senderArea,
          'address': params.senderAddress
        },
        'receiver': {
          'name': params.receiverName || '', // 发件人姓名
          'tel': params.receiverTel || '', // 发件人座机
          'mobile': params.receiverMobile || '', // 发件人手机号
          'company': params.receiverCompany || '', // 发件人公司
          'post_code': params.receiverPostCode || '', // 发件人邮编
          'province': params.receiverProvince,
          'city': params.receiverCity,
          'area': params.receiverArea,
          'address': params.receiverAddress
        },
        'cargo': {
          'count': params.cargoCount || 1, // 包裹数量
          'weight': params.cargoWeight || 1, // 包裹重量
          'space_x': params.cargoSpaceX || 40, // 包裹长度
          'space_y': params.cargoSpaceY || 40, // 包裹宽度
          'space_z': params.cargoSpaceZ || 1, // 包裹高度
          'detail_list': params.detailList || [
            {
              name: '发票',
              count: 1
            }
          ]
        },
        'shop': {
          'wxa_path': 'pages/invoice/index',
          'img_url': '',
          'goods_name': '发票',
          'goods_count': 1
        },
        'insured': {
          'use_insured': 0, // 是否保价
          'insured_value': 0 // 保价价值
        },
        'service': {
          'service_type': params.serviceType,
          'service_name': params.serviceName
        },
        'expect_time': params.expectTime || '' // 预期上门时间
      };

      const response = yield this.ctx.http.post('https://api.weixin.qq.com/cgi-bin/express/business/order/add', data);
      return response;
    }
  }

  return Express;
};