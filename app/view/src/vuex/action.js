export const updateForm = ({ dispatch }, key, val) => {
  dispatch('UPDATE_FORM', key, val)
}

export const loadSupList = ({ dispatch }, params) => {
console.log(params)
  axios.get('http://127.0.0.1:7001/zues/api/supplier/list', { params })
  .then(function (response) {
    dispatch('UPDATE_SUPFORM', 'supplierList', response.data.data.rows)
  })
  .catch(function (response) {
  });
}
