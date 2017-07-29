<template lang="html">
  <bottom-wrap>
  </bottom-wrap>
</template>

<script>
  import bottomWrap from '../common/bottomwrap'
  import {
    updateForm
  } from '../../vuex/action'
  
  export default {
    vuex: {
      actions: {
        updateForm
      }
    },
    data() {
      return {
        topMenuData: [{
            url: '/order/search',
            icon: 'icon-good',
            name: '现货查询'
          },
          {
            url: '/order/cart',
            icon: 'icon-cart',
            name: '购物车'
          },
          {
            url: '/order/list',
            icon: 'icon-order',
            name: '订单列表'
          },{
            url: '/order/demand',
            icon: 'icon-demand',
            name:'定制化需求'
          }
        ]
      }
    },
    mounted: function() {
      this.updateForm('topMenuData', this.topMenuData)
    },
    components: {
      bottomWrap
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
