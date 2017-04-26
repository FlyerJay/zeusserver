<template lang="html">
    <el-row>
      <el-col :span="4">
        <img src="../../../static/img/logo.jpg" class="logo-pic">
      </el-col>
      <el-col :span="20">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" theme="dark">
          <el-menu-item index="1">宙斯报价系统</el-menu-item>
          <el-menu-item index="2">供应商录入</el-menu-item>
          <el-menu-item index="3">订单管理</el-menu-item>
        </el-menu>
      </el-col>
    </el-row>
  </header>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '1',
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      switch (key) {
        case "1":
          this.$router.push('/login')
          break;
        case "2":
          this.$router.push('/login')
          break;
        case "3":
          this.$router.push('/login')
          break;
        default:

      }
    }
  }
}
</script>

<style lang="less" scoped>
  .header {
    .el-menu-demo {
      padding-left: 300px;
    }
    .logo-pic {
      width: 50px;
      height: 50px;
    }
  }

</style>
