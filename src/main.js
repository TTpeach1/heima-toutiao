import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入字体图标
import '@/assets/font/iconfont.css'
// 引入vant
import Vant from 'vant'
import 'vant/lib/index.css'
// rem适配
import 'amfe-flexible'
// showdown引入
import showdown from 'showdown'
import dayjs from '@/utils/dayjs'
// 过滤器封装dayjs
Vue.filter('timeFormat', (el) => {
  return dayjs(el).fromNow()
})
Vue.use(dayjs)
Vue.use(Vant)
Vue.use(showdown)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
