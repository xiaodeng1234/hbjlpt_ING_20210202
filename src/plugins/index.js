import Vue from 'vue'
import VModal from 'vue-js-modal'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Api from '../util/api/api'
import './common.js'
import './spellSearch.js'
import request from "../util/api/request"
import '../assets/main.scss'
import '../assets/common.scss'
import Input from 'ant-design-vue/lib/input'
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

Vue.use(VModal)
Vue.use(ElementUI)
Vue.use(Input)

const requireComponents = require.context('../components', true, /\.vue/)
// 打印结果
// 遍历出每个组件的路径
requireComponents.keys().forEach(fileName => {
  // 组件实例
  const reqCom = requireComponents(fileName)
  // 截取路径作为组件名
  const reqComName = fileName.split('/')[1]
  // 去除组件名中.vue字符串
  let comName = reqComName.replace(/\.\/|\.vue/g, '')
  // 组件挂载
  Vue.component(comName, reqCom.default || reqCom)
})

Vue.prototype.$api = Api
Vue.prototype.$request = request