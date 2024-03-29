import { Message } from 'element-ui'
import axios from 'axios'

export const updateForm = ({ dispatch }, key, val) => {
  dispatch('UPDATE_FORM', key, val)
}

// 加载供应商列表
export const loadSupList = ({ dispatch }, params) => {
  return axios.get('/zues/api/supplier/list', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_SUPFORM', 'supInfo', response.data.data)
      return Promise.resolve()
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 加载供应商所在地
export const loadSupAddress = ({ dispatch }, params) => {
  axios.get('/zues/api/supplier/address', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_SUPFORM', 'supAddress', response.data.data)
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 新增供应商
export const addNewSup = ({ dispatch }, newSupParam) => {
  return axios.post('/zues/api/supplier/add', newSupParam)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve()
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 重置密码
export const resetPasswordAxios = ({ dispatch }, newSupParam) => {
  return axios.post('/zues/api/user/update', newSupParam)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve()
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 新增运费信息
export const addNewFre = ({ dispatch }, params) => {
  return axios.post('/zues/api/freight/add', params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve()
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}
// 删除供应商
export const deletSupplier = ({ dispatch }, params) => {
  return axios.post('/zues/api/supplier/remove', params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve()
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}
// 删除运费信息
export const deleteFreight = ({ dispatch }, params) => {
  return axios.post('/zues/api/freight/remove', params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve()
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 修改供应商----更新所修改的供应商
export const updataSup = ({ dispatch }, newSupParam) => {
  return axios.post('/zues/api/supplier/update', newSupParam)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve()
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 修改供应商出厂价格----更新价格表格
export const updatePrice = ({ dispatch }, newPriceParam) => {
  return axios.post('/zues/api/price/update', newPriceParam)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve()
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 更新库存表库存
export const updateStock = ({ dispatch }, newStockParam, searchSupParam) => {
  return axios.post('/zues/api/inventory/update', newStockParam)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve()
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 现货查询
export const loadStock = ({ dispatch }, params) => {
  return axios.get('/zues/api/product/list', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      response.data.data.row.map(v => {
        v.markType = v.mark || 1
      })
      dispatch('UPDATE_ORDERFORM', 'stockInfo', response.data.data)
      return Promise.resolve()
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 加载到岸目的的地址
export const loadOrdAddress = ({ dispatch }, params) => {
  axios.get('/zues/api/supplier/address', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_ORDERFORM', 'ordAddress', response.data.data)
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 添加到购物车
export const addTocart = ({ dispatch }, params) => {
  return axios.post('/zues/api/chart/addToChart', params)
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_ORDERFORM', 'cartList', response.data.data)
      return Promise.resolve()
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 批量添加到购物车
export const addToChartBatch = ({ dispatch }, params) => {
  return axios.post('/zues/api/chart/addToChartBatch', params)
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_ORDERFORM', 'cartList', response.data.data)
      return Promise.resolve()
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 修改购物车信息
export const updateCart = ({dispatch}, params) => {
  return axios.post('/zues/api/chart/update', params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve()
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 加载购物车列表
export const loadCartList = ({ dispatch }, params) => {
  return axios.get('/zues/api/chart/list', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_ORDERFORM', 'cartList', response.data.data)
      return Promise.resolve()
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 购物车页面，添加到订单列表
export const addToList = ({ dispatch }, params) => {
  return axios.post('/zues/api/order/add', params)
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_ORDERFORM', 'orderList', response.data.data)
      return Promise.resolve()
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 购物车页面，将添加到订单列表的数据从购物车列表中删除
export const removeCartList = ({ dispatch }, params) => {
  return axios.post('/zues/api/chart/remove', params)
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_ORDERFORM', 'cartList', response.data.data)
      return Promise.resolve()
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 加载订单列表
export const loadOrderList = ({ dispatch }, params) => {
  return axios.get('/zues/api/order/list', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_ORDERFORM', 'orderList', response.data.data)
      return Promise.resolve()
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 查看订单详情
export const loadOrderDetail = ({ dispatch }, params) => {
  return axios.get('/zues/api/order/detail', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_ORDERFORM', 'orderDetail', response.data.data.row)
      return Promise.resolve(response.data.data.row)
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 订单列表页，删除未审核的订单；
export const removeOrderList = ({ dispatch }, params) => {
  return axios.post('/zues/api/order/remove', params)
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_ORDERFORM', 'orderList', response.data.data.row)
      return Promise.resolve()
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 供应商价格表
export const loadSupPriceList = ({ dispatch }, params) => {
  return axios.get('/zues/api/price/list', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_SUPFORM', 'price', response.data.data)
      return Promise.resolve()
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 价格表价格调整
export const adjustPrice = ({ dispatch }, params) => {
  return axios.post('/zues/api/price/adjust', params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve()
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 供应商库存数量
export const loadSupInventoryList = ({ dispatch }, params) => {
  return axios.get('/zues/api/inventory/list', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_SUPFORM', 'inventory', response.data.data)
      return Promise.resolve()
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 管理员下单审核界面，加载订单详情
export const loadVerifylist = ({ dispatch }, params) => {
  return axios.get('/zues/api/order/verifylist', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_MANAGERFORM', 'verify', response.data.data)
      return Promise.resolve()
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 管理员审核订单
export const reviewVerify = ({ dispatch }, params) => {
  return axios.post('/zues/api/order/verify', params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve()
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 管理员后操作记录，加载操作表
export const loadOperateList = ({ dispatch }, params) => {
  return axios.get('/zues/api/operate/list', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_MANAGERFORM', 'operateInfo', response.data.data)
      return Promise.resolve()
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 供应商运费
export const loadfreightList = ({ dispatch }, params) => {
  return axios.get('/zues/api/freight/list', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_SUPFORM', 'freightList', response.data.data.row)
      return Promise.resolve()
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 更新供应商运费
export const updateFre = ({ dispatch }, params) => {
  return axios.post('/zues/api/freight/update', params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve()
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 加载定制需求表
export const loadDemandList = (store, params) => {
  return axios.get('/zues/api/demand/list', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      var demandAmount = localStorage.getItem('demandAmount')
      if (demandAmount) {
        demandAmount = JSON.parse(demandAmount)
        console.log(params.state)
        switch (params.state) {
          case '0':
            var submit = store._modules.common.state.demand.submit
            demandAmount.submit += submit
            store._modules.common.state.demand.submit = 0
            break
          case '1':
            var price = store._modules.common.state.demand.price
            demandAmount.price += price
            store._modules.common.state.demand.price = 0
            break
          case '2':
            var priced = store._modules.common.state.demand.priced
            demandAmount.priced += priced
            store._modules.common.state.demand.priced = 0
            break
          case '3':
            var unDeal = store._modules.common.state.demand.unDeal
            demandAmount.unDeal += unDeal
            store._modules.common.state.demand.unDeal = 0
            break
          case '4':
            var deal = store._modules.common.state.demand.deal
            demandAmount.deal += deal
            store._modules.common.state.demand.deal = 0
            break
        }
        localStorage.setItem('demandAmount', JSON.stringify(demandAmount))
      }
      store.dispatch('UPDATE_ORDERFORM', 'demandInfo', response.data.data)
      return Promise.resolve()
    } else if (response.data.code === -1) {
      const dispatch = store.dispatch
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 定制化需求报价
export const loadDemandPriceList = ({ dispatch }, params) => {
  return axios.post('/zues/api/demand/price', params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve()
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 定制化需求报价保存
export const saveDemand = ({ dispatch }, params) => {
  return axios.post('/zues/api/demand/save', params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve()
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 删除需求
export const removeDemandList = ({ dispatch }, params) => {
  return axios.post('/zues/api/demand/remove', params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve()
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 添加的定制需求
export const addToDemandList = ({ dispatch }, params) => {
  return axios.post('/zues/api/demand/add', params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve()
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 更新定制化需求
export const upDateDemandList = ({ dispatch }, params) => {
  return axios.post('/zues/api/demand/update', params)
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_ORDERFORM', 'demandList', response.data.data.row)
      return Promise.resolve()
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 修改需求
export const changeDemandList = ({ dispatch }, params) => {
  return axios.post('/zues/api/demand/submitudapte', params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve()
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 定制化需求明细
export const demandDetailList = ({ dispatch }, params, destination) => {
  return axios.get('/zues/api/demand/detail', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      response.data.data.forEach(v => {
        v.destination = destination
        v.factoryPrice += ''
      })
      dispatch('UPDATE_ORDERFORM', 'demandDetail', response.data.data)
      return Promise.resolve()
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 读取成员信息
export const loadmemberList = ({ dispatch }, params) => {
  return axios.get('/zues/api/userrole/list', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_MANAGERFORM', 'userRoleInfo', response.data.data)
      return Promise.resolve()
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 更新成员权限，修改权限
export const updateuserRole = ({ dispatch }, newParam) => {
  return axios.post('/zues/api/userrole/update', newParam)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve()
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 添加新成员
export const addNewUser = ({ dispatch }, param) => {
  return axios.post('/zues/api/user/register', param)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve()
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 删除用户
export const deleteUser = ({ dispatch }, param) => {
  return axios.post('/zues/api/user/delete', param)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve()
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 删除cookie
export const removeCookie = ({ dispatch }, params) => {
  return axios.post('/zues/api/user/logout', params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve()
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 读取权限
export const getUserRole = ({ dispatch }, params) => {
  return axios.get('/zues/api/userrole/list', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_MANAGERFORM', 'userRole', response.data.data)
      return Promise.resolve()
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

export const getPriceChart = ({ dispatch }, params) => {
  return axios.get('/zues/api/cdata/value', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve(response.data.data)
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

export const printOrder = ({ dispatch }, params) => {
  return axios.post('/zues/api/order/print', params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve(response.data.data)
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

export const defaultAddress = ({ dispatch }, params) => {
  return axios.get('/zues/api/address/default', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve(response.data.data)
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

export const getAddressList = ({ dispatch }, params) => {
  return axios.get('/zues/api/address/list', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve(response.data.data)
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

export const getCarList = ({ dispatch }, params) => {
  return axios.get('/zues/api/car/list', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve(response.data.data)
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

export const newAddress = ({ dispatch }, params) => {
  return axios.post('/zues/api/address/add', params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve(response.data.data)
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

export const newCar = ({ dispatch }, params) => {
  return axios.post('/zues/api/car/add', params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve(response.data.data)
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

export const removeAddress = ({ dispatch }, params) => {
  return axios.post('/zues/api/address/remove', params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve(response.data.data)
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

export const removeCar = ({ dispatch }, params) => {
  return axios.post('/zues/api/car/remove', params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve(response.data.data)
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

export const setDefault = ({ dispatch }, params) => {
  return axios.post('/zues/api/address/setdefault', params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve(response.data.data)
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

export const getCustomerList = ({ dispatch }, params) => {
  return axios.get('/zues/api/customer/list', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve(response.data.data)
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

export const newCustomer = ({ dispatch }, params) => {
  return axios.post('/zues/api/customer/add', params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve(response.data.data)
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

export const removeCustomer = ({ dispatch }, params) => {
  return axios.post('/zues/api/customer/remove', params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve(response.data.data)
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 开启供应商设置
export const openRelate = ({ dispatch }, params) => {
  return axios.post('/zues/api/supplier/open', params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve(response.data.data)
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 关闭供应商设置
export const closeRelate = ({ dispatch }, params) => {
  return axios.post('/zues/api/supplier/close', params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve(response.data.data)
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 设置总共数据默认来源
export const settingDataSource = ({ dispatch }, params) => {
  return axios.post('/zues/api/company/setting', params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve(response.data.data)
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 获取消息列表
export const getMessageList = ({ dispatch }, params) => {
  return axios.get('/zues/api/message/list', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      dispatch('UPDATE_MANAGERFORM', 'messageList', response.data.data)
      return Promise.resolve(response.data.data)
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 添加消息
export const newMessage = ({ dispatch }, params) => {
  return axios.post('/zues/api/message/add', params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve(response.data.data)
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 删除消息
export const removeMessage = ({ dispatch }, params) => {
  return axios.post('/zues/api/message/delete', params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve(response.data.data)
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 修改消息
export const modifyMessage = ({ dispatch }, params) => {
  return axios.post('/zues/api/message/update', params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve(response.data.data)
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 设置总共数据默认来源
export const orderDetailUp = ({ dispatch }, params) => {
  return axios.post('/zues/api/orderdetail/update', params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve(response.data.data)
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

export const priceHistoryGet = ({ dispatch }, params) => {
  return axios.get('/zues/api/demand/pricehistory', { params })
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve(response.data.data)
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject()
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 展示错误信息
export const showErrorMessage = ({ dispatch }, msg) => {
  Message({
    showClose: true,
    message: msg,
    type: 'warning'
  })
}

// 检查重复需求
export const checkRepeateDemand = ({ dispatch }, params) => {
  return axios.post('/zues/api/demand/check', params)
  .then(function (response) {
    if (response.data.code === -1) {
      return Promise.resolve(response.data)
    } else if (response.data.code === 200) {
      console.log(response.data)
      return Promise.reject(response.data)
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 批量查询
export const batchQuery = ({ dispatch }, params) => {
  return axios.post('/zues/api/batch/batch', params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve(response.data.data)
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject(response.data.msg)
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 企业列表
export const enterpriseQuery = ({ dispatch }, params) => {
  return axios.get('/zues/api/enterprise/list', { params })
  .then(response => {
    if (response.data.code === 200) {
      return Promise.resolve(response.data.data)
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject(response.data.msg)
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 企业认证
export const enterpriseAuth = ({ dispatch }, params) => {
  return axios.post('/zues/api/enterprise/auth', params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve(response.data.data)
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject(response.data.msg)
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 发票列表
export const invoiceQuery = ({ dispatch }, params) => {
  return axios.get('/zues/api/invoice/list', { params })
  .then(response => {
    if (response.data.code === 200) {
      return Promise.resolve(response.data.data)
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject(response.data.msg)
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 修改发票
export const invoiceUpdate = ({ dispatch }, params) => {
  return axios.post('/zues/api/invoice/update', params)
  .then(function (response) {
    if (response.data.code === 200) {
      return Promise.resolve(response.data.data)
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject(response.data.msg)
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// /zues/api/enterprise/appendtax
export const appendTaxNumber = ({ dispatch }, params) => {
  return axios.get('/zues/api/enterprise/appendtax', { params })
  .then(response => {
    if (response.data.code === 200) {
      return Promise.resolve(response.data.data)
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject(response.data.msg)
    }
  }).catch(function () {
    return Promise.reject()
  })
}

export const getSellerListX = ({ dispatch }, params) => {
  return axios.get('/zues/api/user/seller', { params })
  .then(response => {
    if (response.data.code === 200) {
      return Promise.resolve(response.data.data)
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject(response.data.msg)
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 需求数统计
export const getDemandCountDateX = ({ dispatch }, params) => {
  return axios.get('/zues/api/statistics/date/demandcount', { params })
  .then(response => {
    if (response.data.code === 200) {
      return Promise.resolve(response.data.data)
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject(response.data.msg)
    }
  }).catch(function () {
    return Promise.reject()
  })
}

// 规格统计
export const getSpecRoundMonthX = ({ dispatch }, params) => {
  return axios.get('/zues/api/statistics/month/spec', { params })
  .then(response => {
    if (response.data.code === 200) {
      return Promise.resolve(response.data.data)
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject(response.data.msg)
    }
  }).catch(function () {
    return Promise.reject()
  })
}

export const getDailyPriceListX = ({ dispatch }, params) => {
  return axios.get('/zues/api/price/daily', { params })
  .then(response => {
    if (response.data.code === 200) {
      return Promise.resolve(response.data.data)
    } else if (response.data.code === -1) {
      showErrorMessage({ dispatch }, response.data.msg)
      return Promise.reject(response.data.msg)
    }
  }).catch(function () {
    return Promise.reject()
  })
}
