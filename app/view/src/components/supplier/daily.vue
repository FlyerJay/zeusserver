<template>
  <div class="sup-info">
    <el-table :data="dataList" style="width: 100%" v-loading.body="loading" element-loading-text="拼命加载中" border>
      <el-table-column
        v-for="(item, index) in colunms"
        :key="index" :property="item.field"
        :label="item.name"
        :fixed="item.fixed"
        width="200px">
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import {
    getDailyPriceListX
  } from '../../vuex/action'

  export default {
    vuex: {
      actions: {
        getDailyPriceListX
      }
    },

    data () {
      return {
        dataList: [],
        loading: false,
        colunms: [{
          name: '规格',
          field: 'spec',
          fixed: true
        }, {
          name: '类型',
          field: 'type',
          fixed: true
        }]
      }
    },

    async created () {
      const data = await this.getDailyPriceListX()
      const supplierIdList = []
      const supplierNameList = []
      const specTypeIndexList = []
      const specTypeList = []
      data[0].forEach(item => {
        if (!supplierIdList.includes(item.supplierId)) {
          supplierIdList.push(item.supplierId)
          supplierNameList.push(item.supplierName)
        }
        const specType = `${item.spec} ${item.type}`
        if (!specTypeIndexList.includes(specType)) {
          specTypeIndexList.push(specType)
          specTypeList.push({
            spec: item.spec,
            type: item.type,
            [`supplier_${item.supplierId}`]: item.value
          })
        } else {
          const index = specTypeIndexList.indexOf(specType)
          specTypeList[index][`supplier_${item.supplierId}`] = item.value
        }
      })
      data[1].forEach(item => {
        if (!supplierIdList.includes(item.supplierId)) {
          supplierIdList.push(item.supplierId)
          supplierNameList.push(item.supplierName)
        }
        const specType = `${item.spec} ${item.type}`
        if (!specTypeIndexList.includes(specType)) {
          specTypeIndexList.push(specType)
          specTypeList.push({
            spec: item.spec,
            type: item.type,
            [`supplier_${item.supplierId}`]: item.value
          })
        } else {
          const index = specTypeIndexList.indexOf(specType)
          specTypeList[index][`supplier_${item.supplierId}`] = item.value
        }
      })
      supplierIdList.forEach((item, index) => {
        this.colunms.push({
          name: supplierNameList[index],
          field: `supplier_${item}`
        })
      });
      this.dataList = specTypeList
    }
  }
</script>
