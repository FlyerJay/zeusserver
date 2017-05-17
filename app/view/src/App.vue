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
        z-index: 100;
        background: #2b3b4b;
    }
    
    main {
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
            padding: 30px 30px;
            margin: 69px 0 0 214px;
            border: 1px solid #e7e7e9;
            border-radius: 5px
        }
    }
    
    .home-wrap {
        height: 100%;
    }
    
    .el-input__inner {
        border-radius: 0;
        height: 31px;
        width: 120px;
    }
</style>
