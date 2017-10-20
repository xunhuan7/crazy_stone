// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    sessionStorage.removeItem('xjs_user');
  }
  let user = sessionStorage.getItem('xjs_user');
  if (!user && to.path != '/login') {
    next({path: '/login'});
  } else {
    next();
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
})
