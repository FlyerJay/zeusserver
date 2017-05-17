<template lang="html">
  <div class="main-wrap">
    <div class="main-left">
      <left-nav></left-nav>
    </div>
    <div class="main-right">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import leftNav from './leftNav'
  
  export default {
    components: {
      leftNav
    }
  }
</script>

<style lang="less">
  
</style>
