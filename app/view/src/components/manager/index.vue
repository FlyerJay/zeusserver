<template lang="html">
  <div class="">
    <div class="main-left">
      <left-nav></left-nav>
    </div>
    <div class="main-right">
      <router-view></router-view>
    </div>
  </div>

</template>

<script>
import leftNav from '../common/leftnav'

export default {
  components: {
    leftNav
  }
}
</script>

<style lang="css">
</style>
