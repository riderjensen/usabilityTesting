import '@babel/polyfill'
import VueRouter from 'vue-router'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'

Vue.config.productionTip = false

Vue.use(VueRouter);

const router = new VueRouter({
  routes
});

new Vue({
  render: h => h(App)
}).$mount('#app')
