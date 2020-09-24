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
      },
      getters: {
        userInfo: ({
            common
        }) => common.userInfo
      }
    },
    data () {
      return {
        topMenuData: [
          {
            url: '/order/search',
            icon: 'icon-good',
            name: '现货查询'
          },
          {
            url: '/order/batchsearch',
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
          },
          {
            url: '/order/demand',
            icon: 'icon-demand',
            name: '需求报价'
          },
          {
            url: '/order/demandview',
            icon: 'icon-demand',
            name: '需求列表'
          }
        ]
      }
    },
    mounted: function () {
      this.userInfo.userRole = this.getCookie('userRole')
      this.comId = this.getCookie('comId')
      if (this.comId === '00') {
        this.topMenuData = []
        const itemArr = [{
          url: '/order/search',
          icon: 'icon-good',
          name: '现货查询'
        },
        {
          url: '/order/list',
          icon: 'icon-order',
          name: '订单列表'
        },
        {
          url: '/order/demandview',
          icon: 'icon-demand',
          name: '需求列表'
        }]
        this.topMenuData = this.topMenuData.concat(itemArr)
      } else {
        if (this.userInfo.userRole) {
          this.topMenuData = []
          if (parseInt(this.userInfo.userRole.charAt(6))) {
            const item = {
              url: '/order/search',
              icon: 'icon-good',
              name: '现货查询'
            }
            this.topMenuData.push(item)
            const batchItem = {
              url: '/order/batchsearch',
              icon: 'icon-batch',
              name: '批量查询'
            }
            this.topMenuData.push(batchItem)
          }
          if (parseInt(this.userInfo.userRole.charAt(5))) {
            const itemArr = [{
              url: '/order/cart',
              icon: 'icon-cart',
              name: '购物车'
            },
            {
              url: '/order/list',
              icon: 'icon-order',
              name: '订单列表'
            },
            {
              url: '/order/demand',
              icon: 'icon-demand',
              name: '需求报价'
            }
            ]
            this.topMenuData = this.topMenuData.concat(itemArr)
          }
        }
      }

      this.updateForm('topMenuData', this.topMenuData)
    },
    components: {
      bottomWrap
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.updateForm('mainRoute', to.path.split('/')[1])
      })
    }
  }
</script>

<style lang="less">
    .tb-wrap{
      margin-top: 20px;
    }
</style>
