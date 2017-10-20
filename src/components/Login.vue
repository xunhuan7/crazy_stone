<template>

  <el-form class="container">

    <h2 class="title">系统登录</h2>

    <el-form-item prop="account">
      <el-input type="text" placeholder="账号" v-model="username"></el-input>
    </el-form-item>

    <el-form-item>
      <el-input type="password" placeholder="密码" v-model="password"></el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" class="login" @click="login">登录</el-button>
    </el-form-item>

  </el-form>

</template>

<script>
  import axios from 'axios';
  let qs = require("qs");

  export default {
    data() {
      return {
        username: '',
        password: ''
      }
    },
    methods: {
      login() {
        let self = this;
        axios.post('user_userLogin.ajax', qs.stringify({
            loginName: self.username,
            password: self.password
          })
        )
          .then(function (res) {
            if (res.data.data === true) {
              sessionStorage.setItem('xjs_user', self.username);
              self.$message({
                message: '登录成功',
                type: 'success',
                duration: 1000
              });
              self.$router.push('/index');
            } else {
              self.$message({
                message: '登录失败',
                type: 'warning',
                duration: 800
              });
            }
          });
      }
    }
  }

</script>

<style scoped>
  .container {
    border-radius: 5px;
    margin: 180px auto;
    width: 320px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 5px #cac6c6;
  }

  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #6e7379;
  }

  .login {
    width: 100%;
  }
</style>
