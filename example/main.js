import Vue from 'vue';
import App from './src/app.vue';

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#root');
