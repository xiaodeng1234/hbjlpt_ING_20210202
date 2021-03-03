import qs from "querystring";
import axios from 'axios'

/**
 * 该方法实现具体请求
 * @param url 请求路径
 * @param data 请求参数
 * @param method 请求方式
 * @param responseType 返回类型
 * @param headers 请求头
 * @returns {Promise<any>} 就扣返回结果
 */
export default ({url, data, method, responseType, headers}) => {
  headers || (headers = {
    'Accept': 'application/json', 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'
  })
  method || (method = "GET")

  let fetchOptions = {
    method: method
  };
  if (responseType) fetchOptions.responseType = responseType
  if (headers) fetchOptions.headers = headers
  // 超时
  axios.defaults.timeout = 30000
  // 一般get 和 delete 请求
  if (/^get$|^delete$/i.test(method)) {
    if (typeof data === 'string') {
      url = `${url}/${data}`
    } else if (typeof data === 'object') {
      url = `${url}?${qs.stringify(data)}`
    }
    return axios[method.toLowerCase()](url).then(res => {
      return res.data
    }).catch(err => {
      if (err.toString().indexOf('Network Error') !== -1) {
        return {status: -1, errMsg: '服务端连接异常'}
      }
      return err.response && err.response.data
    })
  }
  // payload 的 post 和 put 请求
  if (/^post$|^put$/i.test(method)) {
    fetchOptions.body = data
    return axios[method.toLowerCase()](url, data).then(res => {
      return res.data
    }).catch(err => {
      return err.response && err.response.data
    })
  }
  // 设置formData的请求方式
  if(/^postform$/i.test(method)) {
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
    axios.defaults.transformRequest = [(data) => {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }]
    return axios['POST'.toLowerCase()](url, data).then(res => {
      return res.data
    }).catch(err => {
      return err.response && err.response.data
    })
  }
}
