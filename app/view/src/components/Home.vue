<template>
  <div class="home-wrap">
    <header class="header">
      <top-nav></top-nav>
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>
<script>
import topNav from './common/topnav'
export default {
  data() {
    return {
    };
  },
  components: {
    topNav
  },
  methods: {

  }
}
</script>
<style lang="less">
  main {
    display: flex;
    min-height: 800px;
    border: 40px solid #e9ecf1;
    background-color: #fcfcfc;
    .main-left {
      flex: 0 0 200px;
    }
  }
</style>
