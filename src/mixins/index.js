function getSum (a, b) {
  return a + b
}
const mixin = {
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
    },
    //获取当年1月1号和当天日期
    getThisYearTime () {
      let now = new Date()
      let year = now.getFullYear()
      let month = now.getMonth() + 1
      if (month < 10) {
          month = "0" + month
      }
      let date = now.getDate()
      if (date < 10) {
          date = "0" + date
      }
      let endDate = year + "-" + month + "-" + date
      let startDate = year + "-" + "01" + "-" + "01"
      return [startDate, endDate]
    }
  }
}
export default mixin
