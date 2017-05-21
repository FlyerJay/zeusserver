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
    export default {
        vuex: {
            getters: {
                menuArr: ({
                    common
                }) => common.menuArr
            }
        },
        data() {
            return {};
        },
        components: {
            topNav
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
        margin-left: 190px;
        width: 86.4%;
        z-index: 10001;
        background: #2b3b4b;
    }
    
    main {
        background-color: #e9ecf1;
        padding-top: 1px;
        .main-left {
            width: 190px;
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
            margin: 66px 16px 25px 217px;
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
    .el-loading-mask {
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
   
</style>
