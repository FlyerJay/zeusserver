<template lang="html">
  <div class="h-contain clearfix">
    <ul class="nav">
      <li class="nav-item">
        <a href="#/order" class="active">宙斯报价系统</a>
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
    methods: {}
  }
</script>

<style lang="less" scoped>
  .h-contain {
    .nav {
      .nav-item {
        float: left;
        text-align: center;
        height: 43px;
        line-height: 43px;
        cursor: pointer;
      }
      a {
        color: #f3f5f1;
        font-size: 14px;
        padding: 9px 55px;
        &.active {
          background-color: #253340;
          border-bottom: 2px solid #fccc08;
        }
      }
    }
  }
</style>
