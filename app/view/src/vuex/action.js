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
    } else if (response.data.code === -1){
      dispatch('UPDATE_SUPFORM', 'supInfo', {})
      return Promise.reject();
    }
  })
  .catch(function (response) {
  });
}

//加载供应商所在地 
export const loadSupAddress = ({ dispatch }, params) => {
  axios.get('/zues/api/supplier/address', { params })
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
export const addNewSup = ({ dispatch }, newSupParam) => {
  return axios.post('/zues/api/supplier/add', newSupParam)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve();
    } else if (response.data.code === -1) {
      return Promise.reject();
    }
  })
  .catch(function (response) {
  });
}

//新增运费信息 
export const addNewFre = ({ dispatch }, params) => {
  return axios.post('/zues/api/freight/add', params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve();
    } else if (response.data.code === -1) {
      return Promise.reject();
    }
  })
  .catch(function (response) {
  });
}
//删除供应商 
export const deletSupplier = ({ dispatch }, params) => {
  return axios.post('/zues/api/supplier/remove', params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve();
    } else if (response.data.code === -1) {
      return Promise.reject();
    }
  })
  .catch(function (response) {
  });
}
//删除运费信息
export const deleteFreight = ({ dispatch }, params) => {
  return axios.post('/zues/api/freight/remove', params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve();
    } else if (response.data.code === -1) {
      return Promise.reject();
    }
  })
  .catch(function (response) {
  });
}

//修改供应商----更新所修改的供应商
export const updataSup = ({ dispatch },newSupParam) => {
  return axios.post('/zues/api/supplier/update', newSupParam)
  .then(function (response) {
    if (response.data.code === 200) {
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
  return axios.post('/zues/api/price/update', newPriceParam)
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
  return axios.get('/zues/api/product/list', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_ORDERFORM', 'stockInfo', response.data.data)
      return Promise.resolve();
    } else if (response.data.code === -1) {
      dispatch('UPDATE_ORDERFORM', 'stockInfo', [])
      return Promise.reject();
    }
  })
  .catch(function (response) {
  });
}


//加载到岸目的的地址
export const loadOrdAddress = ({ dispatch }, params) => {
  axios.get('/zues/api/supplier/address', { params })
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
  return axios.post('/zues/api/chart/addToChart', params)
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

//修改购物车信息
export const updateCart = ({dispatch},params) => {
  return axios.post('/zues/api/chart/update',params)
  .then(function (response) {
    if (response.data.code === 200) {
      //dispatch('UPDATE_ORDERFORM', 'cartList', response.data.data)
      return Promise.resolve();
    }else if (response.data.code === -1) {
      return Promise.reject();
    }
  })
}

//加载购物车列表
export const loadCartList = ({ dispatch }, params) => {
  return axios.get('/zues/api/chart/list', { params })
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
  return axios.post('/zues/api/order/add', params)
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
  return axios.post('/zues/api/chart/remove', params)
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
  return axios.get('/zues/api/order/detail', { params })
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
  return axios.post('/zues/api/order/remove', params)
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
  return axios.get('/zues/api/price/list', { params })
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
  return axios.get('/zues/api/inventory/list', { params })
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


//管理员下单审核界面，加载订单详情
export const loadSpecList = ({ dispatch }, params) => {
  return axios.get('/zues/api/order/list', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_MANAGERFORM', 'specList', response.data.data.row)
      return Promise.resolve();
    } else if (response.data.code === -1) {
      return Promise.reject();
    }
  })
  .catch(function (response) {
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
      dispatch('UPDATE_MANAGERFORM', 'operateInfo', {})
      return Promise.reject();
    }
  })
  .catch(function (response) {
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
      return Promise.reject();
    }
  })
  .catch(function (response) {
  });
}


//更新供应商运费
export const updateFre = ({ dispatch }, params) => {
  return axios.post('/zues/api/freight/update', params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve();
    } else if (response.data.code === -1) {
      return Promise.reject();
    }
  })
  .catch(function (response) {
  });
}

//加载定制需求表
export const loadDemandList = ({ dispatch }, params) => {
  return axios.get('/zues/api/demand/list', { params })
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

//添加的定制需求
export const addToDemandList = ({ dispatch }, params) => {
  return axios.post('/zues/api/demand/add', params)
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


//读取成员信息
export const loadmemberList = ({ dispatch }, params) => {
  return axios.get('/zues/api/userrole/list', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_MANAGERFORM', 'userRoleInfo', response.data.data)
      return Promise.resolve();
    } else if (response.data.code === -1) {
      dispatch('UPDATE_MANAGERFORM', 'userRoleInfo', {})
      return Promise.reject();
    }
  })
  .catch(function (response) {
  });
}

//更新成员权限，修改权限
export const updateuserRole = ({ dispatch },newParam) => {
  return axios.post('/zues/api/userrole/update', newParam)
  .then(function (response) {
    if (response.data.code === 200) {   
      return Promise.resolve();
    } else if (response.data.code === -1) {
      return Promise.reject();
    }
  })
  .catch(function (response) {
  });
}
