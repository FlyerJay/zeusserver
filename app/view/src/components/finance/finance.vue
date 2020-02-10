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
          url: '/finance/invoice',
          icon: 'icon-review',
          name: '发票审核'
        }, {
          url: '/finance/enterprise',
          icon: 'icon-supplier',
          name: '企业信息'
        }]
      }
    },
    mounted: function () {
      this.updateForm('topMenuData', this.topMenuData)
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.updateForm('mainRoute', to.path.split('/')[1])
      })
    }
  }
</script>

<style lang="less">
  
</style>
