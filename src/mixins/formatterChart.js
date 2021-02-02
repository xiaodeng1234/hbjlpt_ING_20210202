function getSum (a, b) {
  return a + b
}
const formatterInfo = {
  methods: {
    // 过千数据进行格式化
    thousandFormatter (params, index) {
      if (params > 1000) {
        if (this.lastMove && index == this.splitInfo.splitNumber) {
          return `{params|${params / 1000 + 'k'}}`
        } else {
          return params / 1000 + 'k'
        }
      } else {
        if (this.lastMove && index == this.splitInfo.splitNumber) {
          return `{params|${params}}`
        } else {
          return params
        }
      }
    },
    // 将超过四个字的文字隐藏
    hideTextFormatter (params) {
      let str = params
      if (params.length > this.hideTextLen) {
        str = params.substring(0, this.hideTextLen) + '...'
      }
      return str
    },
    // 显示总数量
    showSum (name) {
      let str = name
      if (this.legendText) {
        let elItem = this.seriesData.find(el => el.name === name)
        let unit = '件'
        if (typeof this.numUnit === 'boolean' && this.numUnit) {
          unit = ''
        } else if (typeof this.numUnit === 'string') {
          unit = this.numUnit
        }

        let sum = 0
        elItem.data.forEach(el => {
          sum += getSum(sum, el)
        })
        str = `${
          typeof this.legendText === 'string' ? this.legendText : name
        }（${sum}${unit}）`
      }
      return str
    }
  }
}
export default formatterInfo
