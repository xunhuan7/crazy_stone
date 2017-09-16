//引入关联库
import 'element-ui/lib/theme-default/index.css';
import Vue from 'vue';
import Router from 'vue-router';
import ElementUI from 'element-ui';
import axios from 'axios';
import jQuery from 'jquery';

//引入模块
import Login from '@/components/Login.vue';
import Index from '@/components/Index.vue';
import user from '@/components/user/user.vue';
import type from '@/components/warehouse/type.vue';
import bundle from '@/components/warehouse/bundle.vue';
import process_room from '@/components/process_room/process_room.vue';

Vue.use(Router);
Vue.use(ElementUI);

axios.defaults.baseURL = 'http://192.168.1.102:8080/XJS/';
axios.defaults.timeout = 10000;
axios.defaults.withCredentials = true;

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    }, {
      path: '/index',
      name: 'index',
      component: Index,
      children: [
        {
          path: '/user',
          name: 'user',
          component: user
        },
        {
          path: '/warehouse/type',
          name: 'type',
          component: type
        },
        {
          path: '/warehouse/bundle',
          name: 'bundle',
          component: bundle
        },
        {
          path: '/process_room',
          name: 'process_room',
          component: process_room
        }
      ]
    }
  ]
})
