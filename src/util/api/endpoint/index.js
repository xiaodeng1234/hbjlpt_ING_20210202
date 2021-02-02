let re = require.context('./', true, /(?!=index)\.js$/)
let allApi = {}
re.keys().map(key => {
  let str = key.replace(/\.\/|\.js/g, '').replace(/-(\w)/g, (w, r) => r.toUpperCase()).replace(/\w/, w => w.toUpperCase())
  if (str === 'Index') return
  let apis = re(key).default
  let ENV = re(key).ENV
  for (let apiKey in apis) {
    apis[apiKey].url = `${ENV}${apis[apiKey].endpoint}`
    apis[apiKey].fileInfo = `${key}-${apiKey}`
    if (allApi[apiKey]) {
      throw new Error(`${key}-${apiKey}与${allApi[apiKey].fileInfo}定义冲突`)
    }
    allApi[apiKey] = apis[apiKey]
  }
})
export default allApi
