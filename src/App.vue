<template>

  <div id="app">

    <transition name="el-fade-in-linear">
      <router-view></router-view>
    </transition>

  </div>

</template>

<script>
  export default {
    data() {
      return {}
    },
    methods: {
      status() {
        let user = sessionStorage.getItem('xjs_user');
        if (user) {
          this.$router.push('/index');
        } else {
          this.$router.push('/login');
        }
      }
    },
    mounted: function () {
      this.status();
    }
  }
</script>

<style></style>
