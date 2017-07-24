import { Message } from 'element-ui';
export const updateForm = ({ dispatch }, key, val) => {
  dispatch('UPDATE_FORM', key, val)
}

//加载供应商列表
export const loadSupList = ({ dispatch }, params) => {
  return axios.get('/zues/api/supplier/list', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_SUPFORM', 'supInfo', response.data.data);
      return Promise.resolve();
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg);
      return Promise.reject();
    }
  }).catch(function(error){
    return Promise.reject();
  });
}

//加载供应商所在地 
export const loadSupAddress = ({ dispatch }, params) => {
  axios.get('/zues/api/supplier/address', { params })
  .then(function (response) {
    if (response.data.code === 200) {
     dispatch('UPDATE_SUPFORM', 'supAddress', response.data.data)
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg);
      return Promise.reject();
    }
  }).catch(function(error){
    return Promise.reject();
  });
}

//新增供应商 
export const addNewSup = ({ dispatch }, newSupParam) => {
  return axios.post('/zues/api/supplier/add', newSupParam)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve();
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg);
      return Promise.reject();
    }
  }).catch(function(error){
    return Promise.reject();
  });
}

//新增运费信息 
export const addNewFre = ({ dispatch }, params) => {
  return axios.post('/zues/api/freight/add', params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve();
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg);
      return Promise.reject();
    }
  }).catch(function(error){
    return Promise.reject();
  });
}
//删除供应商 
export const deletSupplier = ({ dispatch }, params) => {
  return axios.post('/zues/api/supplier/remove', params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve();
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg);
      return Promise.reject();
    }
  }).catch(function(error){
    return Promise.reject();
  });
}
//删除运费信息
export const deleteFreight = ({ dispatch }, params) => {
  return axios.post('/zues/api/freight/remove', params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve();
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg);
      return Promise.reject();
    }
  }).catch(function(error){
    return Promise.reject();
  });
}

//修改供应商----更新所修改的供应商
export const updataSup = ({ dispatch },newSupParam) => {
  return axios.post('/zues/api/supplier/update', newSupParam)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve();
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg);
      return Promise.reject();
    }
  }).catch(function(error){
    return Promise.reject();
  });
}

//修改供应商出厂价格----更新价格表格
export const updatePrice = ({ dispatch },newPriceParam) => {
  return axios.post('/zues/api/price/update', newPriceParam)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve();
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg);
      return Promise.reject();
    }
  }).catch(function(error){
    return Promise.reject();
  });
}

//更新库存表库存
export const updateStock = ({ dispatch }, newStockParam, searchSupParam) => {
  return axios.post('/zues/api/inventory/update', newStockParam)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve();
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg);
      return Promise.reject();
    }
  }).catch(function(error){
    return Promise.reject();
  });
}

//现货查询
export const loadStock = ({ dispatch }, params) => {
  return axios.get('/zues/api/product/list', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      response.data.data.row.map(v => {
        v.markType = v.mark || 1;
      })
      dispatch('UPDATE_ORDERFORM', 'stockInfo', response.data.data)
      return Promise.resolve();
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg);
      return Promise.reject();
    }
  }).catch(function(error){
    return Promise.reject();
  });
}


//加载到岸目的的地址
export const loadOrdAddress = ({ dispatch }, params) => {
  axios.get('/zues/api/supplier/address', { params })
  .then(function (response) {
    if (response.data.code === 200) {
     dispatch('UPDATE_ORDERFORM', 'ordAddress', response.data.data)
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg);
      return Promise.reject();
    }
  }).catch(function(error){
    return Promise.reject();
  });
}


//添加到购物车
export const addTocart = ({ dispatch }, params) => {
  return axios.post('/zues/api/chart/addToChart', params)
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_ORDERFORM', 'cartList', response.data.data)
      return Promise.resolve();
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg);
      return Promise.reject();
    }
  }).catch(function(error){
    return Promise.reject();
  });
}

//修改购物车信息
export const updateCart = ({dispatch},params) => {
  return axios.post('/zues/api/chart/update',params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve();
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg);
      return Promise.reject();
    }
  }).catch(function(error){
    return Promise.reject();
  });
}

//加载购物车列表
export const loadCartList = ({ dispatch }, params) => {
  return axios.get('/zues/api/chart/list', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_ORDERFORM', 'cartList', response.data.data)
      return Promise.resolve();
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg);
      return Promise.reject();
    }
  }).catch(function(error){
    return Promise.reject();
  });
}

//购物车页面，添加到订单列表
export const addToList = ({ dispatch }, params) => {
  return axios.post('/zues/api/order/add', params)
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_ORDERFORM', 'orderList', response.data.data)
      return Promise.resolve();
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg);
      return Promise.reject();
    }
  }).catch(function(error){
    return Promise.reject();
  });
}

//购物车页面，将添加到订单列表的数据从购物车列表中删除
export const removeCartList = ({ dispatch }, params) => {
  return axios.post('/zues/api/chart/remove', params)
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_ORDERFORM', 'cartList', response.data.data)
      return Promise.resolve();
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg);
      return Promise.reject();
    }
  }).catch(function(error){
    return Promise.reject();
  });
}

//加载订单列表
export const loadOrderList = ({ dispatch }, params) => {
  return axios.get('/zues/api/order/list', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_ORDERFORM', 'orderList', response.data.data)
      return Promise.resolve();
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg);
      return Promise.reject();
    }
  }).catch(function(error){
    return Promise.reject();
  });
}

//查看订单详情
export const loadOrderDetail = ({ dispatch }, params) => {
  return axios.get('/zues/api/order/detail', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_ORDERFORM', 'orderDetail', response.data.data.row)
      return Promise.resolve(response.data.data.row);
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg);
      return Promise.reject();
    }
  }).catch(function(error){
    return Promise.reject();
  });
}

//订单列表页，删除未审核的订单；
export const removeOrderList = ({ dispatch }, params) => {
  return axios.post('/zues/api/order/remove', params)
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_ORDERFORM', 'orderList', response.data.data.row)
      return Promise.resolve();
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg);
      return Promise.reject();
    }
  }).catch(function(error){
    return Promise.reject();
  });
}

//供应商价格表
export const loadSupPriceList = ({ dispatch }, params) => {
  return axios.get('/zues/api/price/list', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_SUPFORM', 'price', response.data.data)
      return Promise.resolve();
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg);
      return Promise.reject();
    }
  }).catch(function(error){
    return Promise.reject();
  });
}

//价格表价格调整
export const adjustPrice = ({ dispatch }, params) => {
  return axios.post('/zues/api/price/adjust', params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve();
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg);
      return Promise.reject();
    }
  }).catch(function(error){
    return Promise.reject();
  });
}

//供应商库存数量
export const loadSupInventoryList = ({ dispatch }, params) => {
  return axios.get('/zues/api/inventory/list', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_SUPFORM', 'inventory', response.data.data)
      return Promise.resolve();
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg);
      return Promise.reject();
    }
  }).catch(function(error){
    return Promise.reject();
  });
}

//管理员下单审核界面，加载订单详情
export const loadVerifylist = ({ dispatch }, params) => {
  return axios.get('/zues/api/order/verifylist', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_MANAGERFORM', 'verify', response.data.data)
      return Promise.resolve();
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg);
      return Promise.reject();
    }
  }).catch(function(error){
    return Promise.reject();
  });
}

//管理员审核订单
export const reviewVerify = ({ dispatch }, params) => {
  return axios.post('/zues/api/order/verify', params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve();
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg);
      return Promise.reject();
    }
  }).catch(function(error){
    return Promise.reject();
  });
}



//管理员后操作记录，加载操作表
export const loadOperateList = ({ dispatch }, params) => {
  return axios.get('/zues/api/operate/list', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_MANAGERFORM', 'operateInfo', response.data.data)
      return Promise.resolve();
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg);
      return Promise.reject();
    }
  }).catch(function(error){
    return Promise.reject();
  });
}


//供应商运费
export const loadfreightList = ({ dispatch }, params) => {
  return axios.get('/zues/api/freight/list', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_SUPFORM', 'freightList', response.data.data.row)
      return Promise.resolve();
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg);
      return Promise.reject();
    }
  }).catch(function(error){
    return Promise.reject();
  });
}


//更新供应商运费
export const updateFre = ({ dispatch }, params) => {
  return axios.post('/zues/api/freight/update', params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve();
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg);
      return Promise.reject();
    }
  }).catch(function(error){
    return Promise.reject();
  });
}

//加载定制需求表
export const loadDemandList = ({ dispatch }, params) => {
  return axios.get('/zues/api/demand/list', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_ORDERFORM', 'demandInfo', response.data.data)
      return Promise.resolve();
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg);
      return Promise.reject();
    }
  }).catch(function(error){
    return Promise.reject();
  });
}

//定制化需求报价查询
export const loadDemandPriceList = ({ dispatch }, params) => {
  return axios.get('/zues/api/demand/price', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_ORDERFORM', 'demandInfo', response.data.data)
      return Promise.resolve();
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg);
      return Promise.reject();
    }
  }).catch(function(error){
    return Promise.reject();
  });
}


//添加的定制需求
export const addToDemandList = ({ dispatch }, params) => {
  return axios.post('/zues/api/demand/add', params)
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_ORDERFORM', 'demandList', response.data.data.row)
      return Promise.resolve();
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg);
      return Promise.reject();
    }
  }).catch(function(error){
    return Promise.reject();
  });
}

//更新定制化需求
export const upDateDemandList = ({ dispatch }, params) => {
  return axios.post('/zues/api/demand/update',params)
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_ORDERFORM','demandList', response.data.data.row)
      return Promise.resolve();
    }else if (response.data.code === -1) {
      showErrorMessage({ dispatch },response.data.msg);
      return Promise.reject();
    }
  }).catch(function(error) {
    return Promise.reject();
  })
}


//读取成员信息
export const loadmemberList = ({ dispatch }, params) => {
  return axios.get('/zues/api/userrole/list', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_MANAGERFORM', 'userRoleInfo', response.data.data)
      return Promise.resolve();
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg);
      return Promise.reject();
    }
  }).catch(function(error){
    return Promise.reject();
  });
}

//更新成员权限，修改权限
export const updateuserRole = ({ dispatch },newParam) => {
  return axios.post('/zues/api/userrole/update', newParam)
  .then(function (response) {
    if (response.data.code === 200) {   
      return Promise.resolve();
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg);
      return Promise.reject();
    }
  }).catch(function(error){
    return Promise.reject();
  });
}

//添加新成员
export const addNewUser = ({ dispatch }, param) => {
  return axios.post('/zues/api/user/register', param)
  .then(function (response) {
    if (response.data.code === 200) {   
      return Promise.resolve();
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg);
      return Promise.reject();
    }
  }).catch(function(error){
    return Promise.reject();
  });
}

//删除用户
export const deleteUser = ({ dispatch }, param) => {
  return axios.post('/zues/api/user/delete', param)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve();
    }else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg);
      return Promise.reject();
    }
  }).catch(function(error){
    return Promise.reject();
  });
}

//删除cookie
export const removeCookie = ({ dispatch }, params) => {
  return axios.post('/zues/api/user/logout', params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve();
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg);
      return Promise.reject();
    }
  }).catch(function(error){
    return Promise.reject();
  });
}

//读取权限
export const getUserRole = ({ dispatch }, params) => {
  return axios.get('/zues/api/userrole/list', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_MANAGERFORM', 'userRole', response.data.data)
      return Promise.resolve();
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg);
      return Promise.reject();
    }
  }).catch(function(error){
    return Promise.reject();
  });
}

export const getPriceChart = ({ dispatch }, params) => {
  return axios.get('/zues/api/cdata/value',{ params })
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve(response.data.data);
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg);
      return Promise.reject();
    }
  }).catch(function(error){
    return Promise.reject();
  });
}

export const printOrder = ({ dispatch }, params) => {
  return axios.post('/zues/api/order/print',params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve(response.data.data);
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg);
      return Promise.reject();
    }
  }).catch(function(error){
    return Promise.reject();
  });
}

export const defaultAddress = ({ dispatch }, params) => {
  return axios.get('/zues/api/address/default',{ params })
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve(response.data.data);
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg);
      return Promise.reject();
    }
  }).catch(function(error){
    return Promise.reject();
  });
}

export const getAddressList = ({ dispatch }, params) => {
  return axios.get('/zues/api/address/list',{ params })
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve(response.data.data);
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg);
      return Promise.reject();
    }
  }).catch(function(error){
    return Promise.reject();
  });
}

export const newAddress = ({ dispatch }, params) => {
  return axios.post('/zues/api/address/add',params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve(response.data.data);
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg);
      return Promise.reject();
    }
  }).catch(function(error){
    return Promise.reject();
  });
}

export const removeAddress = ({ dispatch }, params) => {
  return axios.post('/zues/api/address/remove',params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve(response.data.data);
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg);
      return Promise.reject();
    }
  }).catch(function(error){
    return Promise.reject();
  });
}

export const setDefault = ({ dispatch }, params) => {
  return axios.post('/zues/api/address/setdefault',params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve(response.data.data);
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg);
      return Promise.reject();
    }
  }).catch(function(error){
    return Promise.reject();
  });
}


//展示错误信息
export const showErrorMessage = ({ dispatch }, msg) => {
  Message({
    showClose: true,
    message: msg,
    type: 'warning'
  });
}