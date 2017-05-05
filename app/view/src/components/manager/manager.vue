<template lang="html">
  <bottom-wrap></bottom-wrap>
</template>

<script>
  import bottomWrap from '../common/bottomwrap'
  import { updateForm } from '../../vuex/action'

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
        topMenuData: [
          {
            url: '/review',
            name: '下单审核'
          },
          {
            url: '/member',
            name: '成员列表'
          },
          {
            url: '/operate',
            name: '操作记录'
          }
        ]
      }
    },
    mounted: function() {
      this.updateForm('topMenuData', this.topMenuData)
    }
  }
</script>

<style lang="less">

</style>
