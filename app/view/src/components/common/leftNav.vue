<template lang="html">
  <div class='leftnav-wrap'>
    <div>
      <a href="#/order" class="nav-logo-wrap clearfix">
        <i class="nav-logo"></i>
        <span class="tit">奎鑫</span>
      </a>
    </div>
    <el-menu default-active="" class="el-menu-vertical-demo" :router="true">
      <el-menu-item :index="menu.url" v-for="(menu, index) in topMenuData" :key="index"  :class="[ $route.path === menu.url ? 'active' : '' ]">
        <i class="iconfont" :class="menu.icon"></i>{{menu.name}}
        <el-badge v-if="menu.name == '需求报价' || menu.name == '带货/直发'" :value="badge" />
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
  import {
    updateForm
  } from '../../vuex/action'
  export default {
    vuex: {
      getters: {
        topMenuData: ({
          common
        }) => common.topMenuData,
        demand: ({
                    common
        }) => common.demand
      },
      actions: {
        updateForm
      },
    },
    computed:{
      badge(val){
        return this.demand.submit + this.demand.price + this.demand.deal + this.demand.unDeal;
      }
    }
  }
</script>

<style lang="less" scoped>
  .leftnav-wrap {
    .nav-logo-wrap {
      display: block;
      padding: 0px 19px;
      margin: 20px 0 30px 0;
      .nav-logo {
        float: left;
        width: 60px;
        height: 42px;
        background-image: url('../../../static/img/logo.png');
        background-size: 100% 100%;
      }
      .tit {
        float: left;
        color: #f3f5f1;
        margin: 4px 0 0 10px;
        font-size: 17px;
      }
    }
    .el-menu {
      .el-menu-item {
        color: #f3f5f1;
        cursor: pointer;
        border-bottom: 1px solid #374c5f;
        .iconfont{
          margin-right:3px;
        }
        &:hover {
          background-color: #253340;
          color: #f3f5f1;
        }
        &.active {
          background-color: #253340;
          border-left: 3px solid #fccc08;
        }
      }
    }
  }

</style>
