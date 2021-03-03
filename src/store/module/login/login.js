import Api from '@/util/api/api'
import Vue from 'vue'
import * as types from '../../mutation-types'
import { Message } from 'element-ui'
export default {
  namespaced: true,
  state: {
    loginDwData: [],
    userInfo: {
      dwbm: '',
      dwmc: '',
      username: ''
    }
  },
  mutations: {
    [types.SAVE_DWBM_TREE] (state, data = []) {
      state.loginDwData = data || []
    },
    [types.SAVE_LOGIN_INFO] (state, data = {}) {
      state.userInfo = data || {}
    }
  },
  actions: {
    // 获取单位i树
    async getDwTree ({ state, commit }) {
      let dwData = []
      try {
        dwData = await Api.getLoginDwTree()
      } catch (err) {
      }
      commit(types.SAVE_DWBM_TREE, dwData)
    },
    // 登录
    async signIn ({ commit }, request) {
      let loginRespose = {}
      const {name: username, dwbm, pwd: password} = request
      try {
        loginRespose = await Api.signIn({ username, dwbm, password })
      } catch (err) {
      }
      return loginRespose
    },
    // 获取功能列表
    async getFuncationList ({ commit }) {
      let userFunctionList = {}
      try {
        userFunctionList = await Api.functionList()
      } catch (error) {
      }
      commit(types.SAVE_FUNCTION_LIST, userFunctionList, { root: true })
    }
  }
}