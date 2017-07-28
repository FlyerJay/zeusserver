<template lang="html">
  <bottom-wrap></bottom-wrap>
</template>

<script>
  import bottomWrap from '../common/bottomwrap'
  import {
    updateForm
  } from '../../vuex/action'
  
  export default {
    components: {
      bottomWrap
    },
    vuex: {
      actions: {
        updateForm
      }
    },
    data() {
      return {
        topMenuData: [{
            url: '/supplier/info',
            name: '供应商'
          },
          {
            url: '/supplier/price',
            name: '价格表'
          },
          {
            url: '/supplier/stock',
            name: '库存表'
          },
          {
            url: '/supplier/demand',
            name: '需求报价'
          },
          // {
          //   url: '/supplier/pricechart',
          //   name: '价格走势',
          // }
        ]
      }
    },
    mounted: function() {
      this.updateForm('topMenuData', this.topMenuData)
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.updateForm('mainRoute', to.path.split('/')[1])
      })
    }
  }
</script>

<style lang="less">
  
</style>
