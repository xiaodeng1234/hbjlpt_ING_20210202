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
    }
  },
  actions: {
    async getDwTree ({ state, commit }) {
      let dwData = []
      try {
        dwData = await Api.getLoginDwTree()
      } catch (err) {
        console.log(err)
      }
      commit(types.SAVE_DWBM_TREE, dwData)
    },
    async signIn ({ commit}, request) {
      let loginRespose = {}
      const {name: username, dwbm, pwd: password} = request
      try {
        loginRespose = await Api.signIn({ request, dwbm, password })
        if(loginRespose.status === 500) throw new Error(loginRespose.note)
      } catch (err) {
        Message({
          message: err,
          type: 'error'
        },true)
      }
    }
  }
}