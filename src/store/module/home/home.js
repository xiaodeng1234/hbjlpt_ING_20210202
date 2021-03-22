import Api from '@/util/api/api'
import * as types from '../../mutation-types'
export default {
    namespaced: true,
    state: {
      dwTree: [],
      sqsxData: [],
      xsajzylxData: [],
      blhjData: []
    },
    mutations: {
      [types.SAVE_HOME_DW_TREE] (state, data) {
        state.dwTree = data || []
      }
    },
    actions: {
      //获取单位树
      async getDwDate ({ state, commit }, dwbm = '420000') {
        let dwData = []
        try {
          dwData = await Api.getDwDate({ dwbm })
        } catch (err) {

        }
        commit(types.SAVE_HOME_DW_TREE, dwData)
      },
    }
  }