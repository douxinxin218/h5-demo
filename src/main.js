import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Axios from '@/assets/plugin/axios';
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);
Vue.use(Axios);
Vue.config.productionTip = false;
if (process.env.NODE_ENV === 'development') {
  const VConsole = require('vconsole');
  new VConsole();
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
