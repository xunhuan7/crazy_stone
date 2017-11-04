<template>

  <el-row class="contain">

    <!--头部导航-->
    <el-col :span="24" class="header">
      <el-col :span="4" class="role">权限：{{ user.role }}</el-col>
      <el-col :span="14" class="enterprise">张钰臻别偷看</el-col>
      <el-col :span="6" class="user-info">欢迎您：{{user.username}}</el-col>
    </el-col>

    <!--内容区-->
    <el-col :span="24" class="main">

      <!--侧边栏-->
      <aside>
        <el-menu unique-opened default-active="1" class="aside-menu">
          <el-menu-item index="1" @click="chooseRouter('1')">
            <i class="el-icon-star-on"></i>用户管理
          </el-menu-item>
          <el-menu-item index="2" @click="chooseRouter('2')">
            <i class="el-icon-star-on"></i>客户管理
          </el-menu-item>
          <el-submenu index="3">
            <template slot="title"><i class="el-icon-star-on"></i>库存管理</template>
            <el-menu-item index="3-1" @click="chooseRouter('31')">种类管理</el-menu-item>
            <el-menu-item index="3-2" @click="chooseRouter('32')">匝管理</el-menu-item>
          </el-submenu>
          <el-menu-item index="4" @click="chooseRouter('4')">
            <i class="el-icon-star-on"></i>加工间
          </el-menu-item>
          <el-menu-item index="5" @click="chooseRouter('5')">
            <i class="el-icon-star-on"></i>订单管理
          </el-menu-item>
        </el-menu>
      </aside>

      <!--主体部分-->
      <section>
        <transition name="el-fade-in">
          <router-view></router-view>
        </transition>
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
        user: {
          role: '',
          username: sessionStorage.getItem('xjs_user')
        }
      }
    },
    methods: {
      // 点击左侧导航栏选择路由
      chooseRouter(index) {
        switch (index) {
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
            ;
        }
      },
      // 获取并展示用户权限和用户名
      getUserInfo() {
        axios.post('user_queryCurrentUser.ajax')
          .then((res) => {
            if (res.data.data === true) {
              this.user.role = res.data.current_user.userName;
              this.user.username = res.data.current_user.loginName;
            }
          });
      }
    },
    mounted: function () {
      this.$router.push("/user");
      this.getUserInfo();
    }
  }

</script>

<style scoped>

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
    font-size: 18px;
    font-weight: 500;
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
