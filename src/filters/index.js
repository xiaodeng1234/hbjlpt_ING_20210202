import { normalTime } from './formatter'
export default {
  normalTime
}
/*使用在main.js 中引入进行全局注册
*注册步骤
1、引入 import filter from './filters'
2、 Objects.keys(filter).forEach(key => Vue.filter(key, filter[key]))
*/