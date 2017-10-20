<template>
  <el-row class="contain">

    <!--头部导航-->
    <el-col :span="24" class="header">
      <el-col :span="4" class="role">{{ config.role }}</el-col>
      <el-col :span="14" class="enterprise">后台管理系统</el-col>
      <el-col :span="6" class="user-info">{{config.username}}</el-col>
    </el-col>

    <!--内容区-->
    <el-col :span="24" class="main">
      <!--侧边栏-->
      <aside>
        <el-menu unique-opened :default-active="config.active_func" class="aside-menu">
          <el-menu-item index="1" @click="chooseFunc('1')">
            <i class="el-icon-star-on"></i>用户管理
          </el-menu-item>
          <el-menu-item index="2" @click="chooseFunc('2')">
            <i class="el-icon-star-on"></i>客户管理
          </el-menu-item>
          <el-submenu index="3">
            <template slot="title"><i class="el-icon-star-on"></i>库存管理</template>
            <el-menu-item index="3-1" @click="chooseFunc('31')">种类管理</el-menu-item>
            <el-menu-item index="3-2" @click="chooseFunc('32')">匝管理</el-menu-item>
          </el-submenu>
          <el-menu-item index="4" @click="chooseFunc('4')">
            <i class="el-icon-star-on"></i>加工间
          </el-menu-item>
          <el-menu-item index="5" @click="chooseFunc('5')">
            <i class="el-icon-star-on"></i>订单管理
          </el-menu-item>
        </el-menu>
      </aside>
      <!--主体部分-->
      <section>
        <router-view></router-view>
      </section>
    </el-col>

  </el-row>
</template>

<script>
  import axios from 'axios';
  let qs = require("qs");

  export default {
    data() {
      return {
        config: {
          role: '',
          active_func: '1',
          username: ''
        }
      }
    },
    methods: {
      init() {
        switch (this.config.active_func) {
          case '1':
            this.$router.push("/user");
            break;
        }
      },
      chooseFunc(which) {
        switch (which) {
          case '1':
            this.$router.push("/user");
            break;
          case '2':
            this.$router.push("/custom");
            break;
          case '31':
            this.$router.push("/warehouse/type");
            break;
          case '32':
            this.$router.push("/warehouse/bundle");
            break;
          case '4':
            this.$router.push("/process_room");
            break;
          case '5':
            this.$router.push("/order");
            break;
          default:
            console.log("点击了" + which);
        }
      },
      // 获取登录用户信息
      getUserInfo() {
        let self = this;
        axios.post('user_queryCurrentUser.ajax')
          .then(function (res) {
            if (res.data.data == true) {
              self.config.role = res.data.role.roleName;
              self.config.username = res.data.current_user.loginName;
            }
          });
      }
    },
    mounted: function () {
      this.init();
      this.getUserInfo();
    }
  }
</script>

<style scoped>
  body {
    margin: 0;
  }

  .contain {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;
    margin-left: -8px;
  }

  /*头部*/
  .header {
    color: #fff;
    background: #20A0FF;
    height: 60px;
    line-height: 60px;
    text-align: center;
  }

  .role {
    font-size: 18px;
    border-right: 1px solid #fff;
  }

  .enterprise {
    font-size: 25px;
    letter-spacing: 2px;
  }

  .user-info {
    font-size: 15px;
    font-weight: 300;
  }

  /*主体*/
  .main {
    display: flex;
    position: absolute;
    top: 60px;
    bottom: 0px;
    overflow: hidden;
  }

  /*侧栏*/
  aside {
    flex: 1;
    border-right: 3px solid #eef1f6;
  }

  .aside-menu {
    height: 100%;
  }

  /*内容区*/
  section {
    flex: 5;
    overflow: scroll;
    padding: 8px;
  }
</style>
