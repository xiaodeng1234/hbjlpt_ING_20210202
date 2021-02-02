import allApi from "./endpoint";
import request from "./request";
import store from "../../store";
async function server(p, data) {
  // 此处可做一些拦截，比如三级错误处理
  let res = await request({...allApi[p], data})
  if(res && res.code === 200) {
    return res.data
  } else {
    console.error(`调用接口${allApi[p].url}`, `${allApi[p].label}出错`,'参数:', data, res)
    // 接口错误，直接关闭加载动画
    store.commit('INITWARNINGINFO')
    return res
  }
}

export default new Proxy({}, {
  get(target, p) {
    if (!allApi[p]) throw new Error(`${p} 接口未定义`)
    return data => server(p, data)
  }
})
