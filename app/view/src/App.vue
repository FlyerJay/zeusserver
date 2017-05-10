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
    body,
    html {
        height: 100%;
        margin: 0;
        padding: 0;
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
        width: 100%;
        z-index: 100;
        background: #303643;
        transition: box-shadow .3s;
        box-shadow: 0 0 8px -1px rgba(0, 0, 0, 0.6);
    }
    
    main {
        background-color: #e9ecf1;
        width: 100%;
        .main-wrap {
            width: 1080px;
            padding: 30px 20px;
            margin: 60px auto;
            display: flex;
            min-height: 800px;
            .main-left {
                background-color: #fcfcfc;
                flex: 0 0 200px;
                .el-menu {
                    background-color: transparent;
                }
            }
            .main-right {
                flex: 1;
                background-color: #fff;
                padding: 50px 70px;
            }
        }
    }
</style>
