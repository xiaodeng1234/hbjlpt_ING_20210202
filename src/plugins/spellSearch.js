import Vue from 'vue'
import spellSearch from 'pinyin-match'

Vue.prototype.$spellSearch = spellSearch
Vue.use(spellSearch)
