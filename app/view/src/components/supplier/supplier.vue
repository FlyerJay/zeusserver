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
      },
      getters: {
        userInfo: ({
            common
        }) => common.userInfo
      }
    },
    data () {
      return {
        topMenuData: [{
          url: '/supplier/info',
          icon: 'icon-supplier',
          name: '供应商'
        },
        {
          url: '/supplier/price',
          icon: 'icon-price',
          name: '价格表'
        },
        {
          url: '/supplier/stock',
          icon: 'icon-inventory',
          name: '库存表'
        }, {
          url: '/supplier/pricechart',
          icon: 'icon-trend',
          name: '价格走势'
        }]
      }
    },
    mounted: function () {
      this.userInfo.userRole = this.getCookie('userRole')
      if (this.userInfo.userRole) {
        this.topMenuData = []
        if (parseInt(this.userInfo.userRole.charAt(7))) {
          const item = {
            url: '/supplier/setting',
            icon: 'icon-supplier',
            name: '供应商'
          }
          this.topMenuData.push(item)
        } else if (parseInt(this.userInfo.userRole.charAt(3))) {
          const item = {
            url: '/supplier/info',
            icon: 'icon-supplier',
            name: '供应商'
          }
          this.topMenuData.push(item)
        }
        if (parseInt(this.userInfo.userRole.charAt(6))) {
          const itemArr = [
            {
              url: '/supplier/price',
              icon: 'icon-price',
              name: '价格表'
            },
            {
              url: '/supplier/stock',
              icon: 'icon-inventory',
              name: '库存表'
            }
          ]
          this.topMenuData = this.topMenuData.concat(itemArr)
        }
      }
      this.updateForm('topMenuData', this.topMenuData)
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.updateForm('mainRoute', to.path.split('/')[1])
      })
    }
  }
</script>
