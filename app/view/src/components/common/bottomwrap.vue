<template lang="html">
  <div class="main-wrap">
    <div class="main-left">
      <bottom-nav></bottom-nav>
    </div>
    <div class="main-right">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import bottomNav from './bottomnav'

export default {
  components: {
    bottomNav
  }
}
</script>

<style lang="less">

</style>
