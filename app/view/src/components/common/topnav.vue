<template lang="html">
  <div class="h-contain clearfix">
    <ul class="nav clearfix">
      <li class="nav-item">
        <a href="#/order/search" :class="[ mainRoute === 'order' ? 'active' : '' ]">宙斯报价系统</a>
      </li>
      <li class="nav-item">
        <a href="#/supplier/info" :class="[ mainRoute === 'supplier' ? 'active' : '' ]">供应商录入</a>
      </li>
      <li class="nav-item">
        <a href="#/manager/review" :class="[ mainRoute === 'manager' ? 'active' : '' ]">管理员后台</a>
      </li>
      <li class="user-wrap">
        <span>欢迎，{{userInfo.userId}}</span><span class="vertline">|</span></spalign><span @click="loginout()" class="loginout">退出系统</span>
      </li>
    </ul>
    <div>
    </div>
  </div>
</template>

<script>
    import {
      removeCookie
    } from '../../vuex/action'

  export default {
    vuex: {
      actions:{
          removeCookie
      },
      getters: {
        mainRoute: ({
          common
        }) => common.mainRoute,
        userInfo: ({
          common
        }) => common.userInfo
      }
    },
    methods: {
      loginout() {
        this.delCookie('userId');
        this.delCookie('comId');
        this.removeCookie(this.userInfo)
        .then(rs => {
            document.location.href = "login.html"
           })
      },
      getCookie(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
          return unescape(arr[2]);
        else
          return null;
      },
      delCookie(name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = this.getCookie(name);
        if (cval != null)
          document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
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
    .user-wrap {
      color: #fff;
      position: absolute;
      right: 215px;
      top: 11px;
      .loginout {
        display: inline-block;
        cursor: pointer;
      }
      .vertline {
        display: inline-block;
        margin: 0 10px;
      }
    }
  }
</style>
