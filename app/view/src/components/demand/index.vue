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
  data () {
    return {
      topMenuData: [{
        url: '/demand/manage',
        icon: 'icon-review',
        name: '带货/直发'
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
