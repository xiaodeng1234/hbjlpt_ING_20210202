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
    method: 'POSTFORM',
    label: '用户登录',
    endpoint: '/account/signIn',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  },
  functionList: {
    method: 'GET',
    label: '获取用户功能列表',
    endpoint: '/account/functionList'
  }
}
  
  export const ENV = REMOTE_ADDR