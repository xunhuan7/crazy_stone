<template>

  <el-form class="container">

    <h4 class="title">系统登录</h4>

    <el-form-item prop="account">
      <el-input type="text" placeholder="账号" v-model="username"></el-input>
    </el-form-item>

    <el-form-item>
      <el-input type="password" placeholder="密码" v-model="password"></el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" class="login" @click="flag && login()" v-loading="loading">登录</el-button>
    </el-form-item>

  </el-form>

</template>

<script>

  import axios from 'axios';

  let qs = require("qs");

  export default {
    data() {
      return {
        loading: false,
        flag: true,
        username: '',
        password: ''
      }
    },
    methods: {
      login() {
        // 输入为空
        if (!this.username || !this.password) {
          this.$message({
            message: '账号或密码不能为空',
            type: 'warning',
            duration: 800
          });
          return;
        }
        // 输入不为空
        this.loading = true;
        this.flag = false;
        axios.post('user_userLogin.ajax', qs.stringify({
            loginName: this.username,
            password: this.password
          })
        )
          .then((res) => {
            if (res.data.data === true) {
              this.loading = false;
              this.flag = true;
              sessionStorage.setItem('xjs_user', this.username);
              this.$message({
                message: '登录成功',
                type: 'success',
                duration: 1000
              });
              this.$router.push('/index');
            } else {
              this.loading = false;
              this.flag = true;
              this.$message({
                message: res.data.msg,
                type: 'error',
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
    margin: 150px auto;
    width: 320px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 5px #cac6c6;
  }

  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }

  .login {
    width: 100%;
  }

</style>
