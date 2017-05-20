export const updateForm = ({ dispatch }, key, val) => {
  dispatch('UPDATE_FORM', key, val)
}

//加载供应商列表
export const loadSupList = ({ dispatch }, params) => {
  return axios.get('http://127.0.0.1:7001/zues/api/supplier/list', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_SUPFORM', 'supList', response.data.data.row);
      return Promise.resolve();
    } else if (response.data.code === -1){
      dispatch('UPDATE_SUPFORM', 'supList', [])
      return Promise.reject();
    }
  })
  .catch(function (response) {
  });
}

//加载供应商所在地 
export const loadSupAddress = ({ dispatch }, params) => {
  axios.get('http://127.0.0.1:7001/zues/api/supplier/address', { params })
  .then(function (response) {
    if (response.data.code === 200) {
     dispatch('UPDATE_SUPFORM', 'supAddress', response.data.data)
    } else if (response.data.code === -1) {
     dispatch('UPDATE_SUPFORM', 'supAddress', [])
    }
  })
  .catch(function (response) {
  });
}

//新增供应商 
export const addNewSup = ({ dispatch }, newSupParam, searchSupParam) => {
  return axios.post('http://127.0.0.1:7001/zues/api/supplier/add', newSupParam)
  .then(function (response) {
    if (response.data.code === 200) {
      loadSupList({ dispatch }, searchSupParam);
      return Promise.resolve();
    } else if (response.data.code === -1) {
      return Promise.reject();
    }
  })
  .catch(function (response) {
  });
}

//修改供应商----更新所修改的供应商
export const updataSup = ({ dispatch },newSupParam, searchSupParam) => {
  return axios.post('http://127.0.0.1:7001/zues/api/supplier/update', newSupParam)
  .then(function (response) {
    if (response.data.code === 200) {
      loadSupList({ dispatch }, searchSupParam);
      return Promise.resolve();
    } else if (response.data.code === -1) {
      return Promise.reject();
    }
  })
  .catch(function (response) {
  });
}

//修改供应商出厂价格----更新价格表格
export const updataPrice = ({ dispatch },newPriceParam, searchSupParam) => {
  return axios.post('http://127.0.0.1:7001/zues/api/price/update', newPriceParam)
  .then(function (response) {
    if (response.data.code === 200) {
      loadSupPriceList({ dispatch }, searchSupParam);
      return Promise.resolve();
    } else if (response.data.code === -1) {
      return Promise.reject();
    }
  })
  .catch(function (response) {
  });
}

//现货查询
export const loadStock = ({ dispatch }, params) => {
  return axios.get('http://127.0.0.1:7001/zues/api/product/list', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_ORDERFORM', 'stockList', response.data.data.row)
      return Promise.resolve();
    } else if (response.data.code === -1) {
      dispatch('UPDATE_ORDERFORM', 'stockList', [])
      return Promise.reject();
    }
  })
  .catch(function (response) {
  });
}


//加载到岸目的的地址
export const loadOrdAddress = ({ dispatch }, params) => {
  axios.get('http://127.0.0.1:7001/zues/api/supplier/address', { params })
  .then(function (response) {
    if (response.data.code === 200) {
     dispatch('UPDATE_ORDERFORM', 'ordAddress', response.data.data)
    } else if (response.data.code === -1) {
     dispatch('UPDATE_ORDERFORM', 'ordAddress', [])
    }
  })
  .catch(function (response) {
  });
}


//添加到购物车
export const addTocart = ({ dispatch }, params) => {
  return axios.post('http://127.0.0.1:7001/zues/api/chart/addToChart', params)
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_ORDERFORM', 'cartList', response.data.data.row)
      return Promise.resolve();
    } else if (response.data.code === -1) {
      return Promise.reject();
    }
  })
  .catch(function (response) {
  });
}

//加载购物车列表
export const loadCartList = ({ dispatch }, params) => {
  return axios.get('http://127.0.0.1:7001/zues/api/chart/list', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_ORDERFORM', 'cartList', response.data.data.row)
      return Promise.resolve();
    } else if (response.data.code === -1) {
      return Promise.reject();
    }
  })
  .catch(function (response) {
  });
}

//购物车页面，添加到订单列表
export const addToList = ({ dispatch }, params) => {
  return axios.post('http://127.0.0.1:7001/zues/api/order/add', params)
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_ORDERFORM', 'orderList', response.data.data.row)
      return Promise.resolve();
    } else if (response.data.code === -1) {
      return Promise.reject();
    }
  })
  .catch(function (response) {
  });
}

//购物车页面，将添加到订单列表的数据从购物车列表中删除
export const removeCartList = ({ dispatch }, params) => {
  return axios.post('http://127.0.0.1:7001/zues/api/chart/remove', params)
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_ORDERFORM', 'cartList', response.data.data.row)
      return Promise.resolve();
    } else if (response.data.code === -1) {
      return Promise.reject();
    }
  })
  .catch(function (response) {
  });
}



//加载订单详情
export const loadOrderList = ({ dispatch }, params) => {
  return axios.get('http://127.0.0.1:7001/zues/api/order/list', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_ORDERFORM', 'orderList', response.data.data.row)
      return Promise.resolve();
    } else if (response.data.code === -1) {
      return Promise.reject();
    }
  })
  .catch(function (response) {
  });
}

//订单详情页，删除未审核的订单；
export const removeOrderList = ({ dispatch }, params) => {
  return axios.post('http://127.0.0.1:7001/zues/api/order/remove', params)
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_ORDERFORM', 'orderList', response.data.data.row)
      return Promise.resolve();
    } else if (response.data.code === -1) {
      return Promise.reject();
    }
  })
  .catch(function (response) {
  });
}






//供应商价格表
export const loadSupPriceList = ({ dispatch }, params) => {
  return axios.get('http://127.0.0.1:7001/zues/api/price/list', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_SUPFORM', 'priceList', response.data.data.row)
      return Promise.resolve();
    } else if (response.data.code === -1) {
      return Promise.reject();
    }
  })
  .catch(function (response) {
  });
}

//供应商库存数量
export const loadSupInventoryList = ({ dispatch }, params) => {
  return axios.get('http://127.0.0.1:7001/zues/api/inventory/list', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_SUPFORM', 'inventoryList', response.data.data.row)
      return Promise.resolve();
    } else if (response.data.code === -1) {
      return Promise.reject();
    }
  })
  .catch(function (response) {
  });
}

//定制货品价格列表,上传文件
export const upLoadFile = ({ dispatch }, params) => {
  return axios.post('http://127.0.0.1:7001/zues/api/upload/excel')
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_ORDERFORM', 'demandList', response.data.data.row)
      return Promise.resolve();
    } else if (response.data.code === -1) {
      return Promise.reject();
    }
  })
  .catch(function (response) {
  });
}
