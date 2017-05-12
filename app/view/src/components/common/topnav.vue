<template lang="html">
  <div class="h-contain clearfix">
    <ul class="nav">
      <li class="nav-item">
        <a href="#/order/search" :class="[ mainRoute === 'order' ? 'active' : '' ]">宙斯报价系统</a>
      </li>
      <li class="nav-item">
        <a href="#/supplier/info" :class="[ mainRoute === 'supplier' ? 'active' : '' ]">供应商录入</a>
      </li>
      <li class="nav-item">
        <a href="#/manager/review" :class="[ mainRoute === 'manager' ? 'active' : '' ]">管理员后台</a>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    vuex: {
      getters: {
        mainRoute: ({
          common
        }) => common.mainRoute
      }
    }
  }
</script>

<style lang="less" scoped>
  .h-contain {
    .nav {
      .nav-item {
        float: left;
        text-align: center;
        height: 44px;
        line-height: 43px;
        cursor: pointer;
      }
      a {
        color: #f3f5f1;
        font-size: 14px;
        padding: 9px 55px;
        &.active {
          background-color: #253340;
          border-bottom: 3px solid #fccc08;
        }
        &:hover {
          background-color: #253340;
        }
      }
    }
  }
</style>
