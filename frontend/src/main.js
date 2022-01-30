import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import moment from 'moment'
moment.locale('fr')

// Déclaration de functions globales et initialisation de l'application
Vue.config.productionTip = false
Vue.prototype.$moment = moment
Vue.prototype.$getCookie = function (cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') { c = c.substring(1); }
    if (c.indexOf(name) == 0) { return c.substring(name.length, c.length); }
  }
  return "";
};

new Vue({ router, store, vuetify, render: h => h(App) }).$mount('#app')
