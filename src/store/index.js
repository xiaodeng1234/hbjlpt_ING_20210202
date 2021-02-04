import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 动态引入./modules下的vuex文件
const dynamicModules = {}
const files = require.context('.', true, /\.js$/)
const dynamicImportModules = (modules, file, splits, index = 0) => {
  if (index == 0 && splits[0] == 'module' || splits[0] == 'mutation-types') {
    ++index
  }
  if (splits.length -1 == index + 1) {
    if ('index' == splits[index]) {
      modules[splits[index - 1]] = files(file).default
    } else {
      modules[splits[index]] = files(file).default
    }
  }
}

// 装载模块
files
  .keys()
  .filter(file => file != './index.js')
  .forEach(file => {
    let splits = file.replace(/(\.\/|\.js)/g, '').split('/')
    dynamicImportModules(dynamicModules, file, splits)
  })
export default new Vuex.Store({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: dynamicModules
})
