<template lang="html">
  <bottom-wrap></bottom-wrap>
</template>

<script>
  import bottomWrap from '../common/bottomwrap'
  import { updateForm } from '../../vuex/action'

  export default {
    vuex: {
      actions: {
        updateForm
      }
    },
    data() {
      return {
        topMenuData: [
          {
            url: '/order/search',
            name: '厂家现货查询'
          },
          {
            url: '/order/cart',
            name: '购物车'
          },
          {
            url: '/order/detail',
            name: '订单详情'
          }
        ]
      }
    },
    mounted: function() {
      this.updateForm('topMenuData', this.topMenuData)
    },
    components: {
      bottomWrap
    }
  }
</script>

<style lang="less">

</style>
