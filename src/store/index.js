import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { v4 as uuidv4 } from 'uuid'
import * as types from './mutation-types'
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
const menuListR = (data) => {
  console.log(data)
  if(data.length < 1) return []
    let arr = [...data]
    deepTraversal(arr)
    return arr
}
// 遍历数组 ，进行重组
const deepTraversal = (arr) => {
  arr.map(cur => {
    cur.id = uuidv4()
    cur.text = cur.flmc || cur.gnmc
    cur.gnct = cur.gnct?.replace(/\.\/|\.html/g, '')
    if(cur.functionList && cur.functionList.length > 0) {
      deepTraversal(cur.functionList)
    }
    return cur
  })
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
    menuList : []
  },
  getters: {
  },
  mutations: {
    // 保存功能列表
    [types.SAVE_FUNCTION_LIST] (state, data) {
      state.menuList = menuListR(data?.value || [])
      state.menuList.unshift({
        id: uuidv4(),
        gnct: '/home',
        text: '首页',
        functionList: []
      })
    },
  },
  actions: {
  },
  modules: dynamicModules,
  plugins: [
    createPersistedState({
      storage: window.sessionStorage
    })
  ]
})
