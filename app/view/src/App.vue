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
        position: absolute;
        top: 0;
        left: 0;
        margin-left: 190px;
        width: 100%;
        z-index: 100;
        background: #2b3b4b;
    }
    
    main {
        background-color: #e9ecf1;
        width: 100%;
        .main-wrap {
            margin: 60px auto;
            display: flex;
            .main-left {
                position: absolute;
                left: 0;
                top: 0;
                width: 190px;
                height: 100%;
                z-index: 101;
                background-color: #33485b;
                flex: 0 0 200px;
                .el-menu {
                    background-color: transparent;
                }
            }
            .main-right {
                flex: 1;
                background-color: #fff;
                padding: 50px 70px;
                margin-left: 190px;
            }
        }
    }
</style>
