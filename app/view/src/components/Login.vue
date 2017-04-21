<template>
    <el-row class="content">
    <el-col :xs="24" :sm="{span: 6,offset: 9}">
      <el-switch on-text="登录" off-text="注册" v-model="inOut" on-color="#20A0FF" off-color="#42d885">
      </el-switch>
        <el-row>
          <el-input
            v-model="name"
            placeholder="账号"
            type="text">
          </el-input>
          <el-input
            v-model="password"
            placeholder="密码"
            type="password">
          </el-input>
          <template v-if="inOut">
            <el-button type="primary"  @click="login">登录</el-button>
          </template>
          <template  v-else>
            <el-popover
              placement="right"
              width="200"
              trigger="focus"
              :content=tips>
            <el-input
            placeholder="确认密码"
            v-model="password_r"
            type="password" slot="reference">
          </el-input>
            </el-popover>
          <el-button type="success"  @click="register">注册</el-button>
          </template>
        </el-row>
    </el-col>
  </el-row>
</template>
<script>
    export default {
    data () {
      return {
        name: '',
        password: '',
        password_r:'',
        inOut: true,
        tips:"输入密码啊"
      }
    },
    watch: {
    // 如果 question 发生改变，这个函数就会运行
    password_r: function () {
      if(this.password_r ==''){
        this.tips="输入密码啊"
      }
      else if(this.password_r != this.password)
      {
        this.tips="两次密码不一样哦"
      }
      else
        this.tips="对接成功，可以注册了"
    }
  },
  methods:{
    login() {
           this.$message({
          message:  `欢迎${this.name}同学`,
          type: 'success'
        })
        },
    register() {
        this.$message({
          message:  `新同学${this.name}注册成功`,
          type: 'success'
        })
      }
    }
  }
</script>
<style lang="" scoped>

</style>
