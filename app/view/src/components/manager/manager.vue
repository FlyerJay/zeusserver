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
      }
    },
    data() {
      return {
        topMenuData: [{
            url: '/manager/review',
            name: '下单审核'
          },
          {
            url: '/manager/member',
            name: '成员列表'
          },
          {
            url: '/manager/operate',
            name: '操作记录'
          }
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
