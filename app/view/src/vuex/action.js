export const updateForm = ({ dispatch }, key, val) => {
  dispatch('UPDATE_FORM', key, val)
}

//加载供应商列表
export const loadSupList = ({ dispatch }, params) => {
  axios.get('http://127.0.0.1:7001/zues/api/supplier/list', { params })
  .then(function (response) {
    if (response.data.code === 200) {
     dispatch('UPDATE_SUPFORM', 'supList', response.data.data.row)
    } else if (response.data.code === -1){
     dispatch('UPDATE_SUPFORM', 'supList', [])
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

//现货查询
export const loadStock = ({ dispatch }, params) => {
  return axios.get('http://127.0.0.1:7001/zues/api/product/list', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_ORDERFORM', 'stockList', response.data.data.row)
      return Promise.resolve();
    } else if (response.data.code === -1) {
      return Promise.reject();
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
      dispatch('UPDATE_ORDERFORM', 'stockList', response.data.data.row)
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
