<template lang="html">
    <el-menu default-active="" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
      <el-menu-item :index="menu.url" v-for="(menu, index) in topMenuData" :key="index">{{menu.name}}</el-menu-item>
    </el-menu>
</template>
<script>
  import { updateForm } from '../../vuex/action'
  export default {
    vuex: {
      getters: {
        topMenuData: ({ common }) => common.topMenuData
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

<style lang="css">
</style>
