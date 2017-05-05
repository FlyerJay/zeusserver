<template lang="html">
  <div class="h-contain clearfix">
    <a href="" class="nav-logo-wrap">
      <img src="../../../static/img/logo.png" alt="奎鑫" class="nav-logo">
    </a>
    <ul class="nav">
      <li class="nav-item">
        <a href="#/order" class="">宙斯报价系统</a>
      </li>
      <li class="nav-item">
        <a href="#/supplier" class="">供应商录入</a>
      </li>
      <li class="nav-item">
        <a href="#/manager" class="">管理员后台</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '1',
    };
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
  .h-contain {
      width: 945px;
      padding: 0 20px;
      margin: 0 auto;
      .nav-logo-wrap {
        float: left;
        .nav-logo {
          display: inline-block;
          vertical-align: middle;
          width: 60px;
          height: 60px;
        }
      }
      .nav {
        float: left;
        .nav-item {
          display: inline-block;
          vertical-align: middle;
        }
        a {
          color: rgba(255,255,255,0.8);
          font-size: 16px;
          padding: 10px 7px;
          line-height: 26px;
          margin: 0 0 0 20px;
        }
      }
  }
</style>
