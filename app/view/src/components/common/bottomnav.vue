<template lang="html">
  <div class='leftnav-wrap'>
    <div>
      <a href="#/order" class="nav-logo-wrap clearfix">
        <i class="nav-logo"></i>
        <span class="leftnav-tit">奎鑫</span>
      </a>
    </div>
    <el-menu default-active="" class="el-menu-vertical-demo" :router="true" @open="handleOpen" @close="handleClose">
      <el-menu-item :index="menu.url" v-for="menu in topMenuData" :key="index">{{menu.name}}</el-menu-item>
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
        }) => common.topMenuData
      },
      actions: {
        updateForm
      }
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>

<style lang="less" scoped>
  .leftnav-wrap {
    .nav-logo-wrap {
      display: block;
      padding: 0 4px;
      .nav-logo {
        float: left;
        width: 93px;
        height: 94px;
        background-image: url('../../../static/img/logo.png');
        background-size: 100% 100%;
      }
      .leftnav-tit {
        float: left;
        color: #f3f5f1;
        margin: 35px 0 0 5px;
      }
    }
    .el-menu {
      .el-menu-item {
        color: #f3f5f1;
        cursor: pointer;
        &:hover {
          background-color: #253340;
          color: #f3f5f1;
        }
        &.is-active {
          background-color: #253340;
          border-left: 2px solid #fccc08;
        }
      }
    }
  }

</style>
