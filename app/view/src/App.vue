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
    import topNav from './components/common/topnav'
    import {
        updateForm
    } from './vuex/action'
    export default {
      vuex: {
        getters: {
          menuArr: ({
                    common
                }) => common.menuArr,
          userInfo: ({
                    common
                }) => common.userInfo
        },
        actions: {
          updateForm
        }
      },
      data () {
        return {}
      },
      components: {
        topNav
      },
      methods: {
        isLogin () {
          var userId = this.getCookie('userId')
          var comId = this.getCookie('comId')
          var userRole = this.getCookie('userRole')
          var info = {
            userId: userId,
            comId: comId,
            userRole: userRole
          }
          this.socket.emit('info', info)
          if (userId) {
            this.updateForm('userInfo', info)
          } else {
            document.location.href = 'login.html'
          }
        }
      },
      mounted: function () {
        this.isLogin()
      }
    }
</script>

<style lang="less">
    * {
        margin: 0;
        padding: 0;
    }
    
    body,
    html {
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #e9ecf1;
    }
    
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        height: 100%;
    }
    
    li,
    ul {
        list-style: none;
    }
    
    a {
        text-decoration: none;
    }
    
    .clearfix {
        &:after {
            content: "";
            display: block;
            height: 0;
            clear: both;
            visibility: hidden;
        }
    }
    
    header {
        position: fixed;
        top: 0;
        left: 0;
        padding-left: 120px;
        background: #2b3b4b;
        width: 100%;
        z-index: 100;
    }
    
    main {
        background-color: #e9ecf1;
        padding-top: 1px;
        .main-left {
            width: 120px;
            height: 100%;
            z-index: 101;
            background-color: #33485b;
            position: fixed;
            top: 0px;
            .el-menu {
                background-color: transparent;
            }
        }
        .main-right {
            background-color: #fff;
            padding: 25px 25px;
            margin: 60px 16px 25px 137px;
            border: 1px solid #e7e7e9;
            border-radius: 5px;
        }
        .page-wrap {
            float: right;
            margin-top: 20px;
            .el-pagination {
                li {
                    &.active {
                        background-color: #f7ba2a;
                        border-color: #f7ba2a;
                        &:hover {
                            color: #fff;
                        }
                    }
                    &:hover {
                        color: #f7ba2a;
                    }
                }
                .btn-next,
                .btn-prev {
                    &:hover {
                        color: #f7ba2a;
                    }
                }
            }
        }
    }
    
    .el-input__inner {
        border-radius: 0;
        height: 31px;
        width: 120px;
    }
    
    body .el-loading-mask {
        z-index: 99;
        .el-loading-spinner {
            .path {
                stroke: #f7ba2a;
            }
            .el-loading-text {
                color: #f7ba2a;
            }
        }
    }
    
    .home-wrap {
        .el-button.el-button--default {
            &:hover {
                color: #f7ba2a;
                border: 1px solid #f7ba2a;
            }
        }
        .el-icon-close {
            &:hover {
                color: #f7ba2a;
            }
        }
    }
    body {
        .el-message-box__btns .el-button--default{
            background-color:#FFF;
            border: 1px solid #bfcbd9;
            color:#1f2d3d;
        }
        .el-message-box__btns .el-button--primary{
            background-color:#f7ba2a;
            border: 1px solid #f7ba2a;
            color:#FFF;
        } 
        .el-message-box__btns .el-button--default:hover{
            border: 1px solid #f7ba2a;
            color:#f7ba2a;
        }
        .el-message-box__btns .el-button--primary:hover{
            background-color:#f7ba2a;
            opacity: 0.5;
            color:#fff;
        }
    }


</style>
