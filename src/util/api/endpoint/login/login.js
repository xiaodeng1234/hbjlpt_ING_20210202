/***
 * 通用接口配置
 */
export default {
  // 获取单位数
  getLoginDwTree: {
    method: 'GET',
    label: '获取登录单位树',
    endpoint: '/account/loginDwbmTree'
  },
  // 用户登录
  signIn: {
    method: 'POST',
    label: '用户登录',
    endpoint: '/account/signIn'
  }
}
  
  export const ENV = REMOTE_ADDR