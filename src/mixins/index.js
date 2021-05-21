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
    hideTextFormatter (params, hideTextLen) {
      let str = params
      if (params.length > hideTextLen) {
        str = params.substring(0, hideTextLen) + '...'
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
    },
    //echarts formater
    chartFormatter (params, name) {
      let param = params[0];
      let html ="";
      html+='<div>'
      html+='<div>'+ name +'</div>'
      html+='<div>'
      html+=`<span style="background-color:${param.color};width: 10px;height:10px;border-radius: 50%;display: inline-block;margin-right:5px;"></span>`
      html+=`<span>${param.axisValue}：${param.data.value}</span>`
      html+='</div>'
      html+='</div>'
      return html;
    },
    // 渲染办理环节图例
    drawBlhjChar (id, data) {
      let dom = document.getElementById(id)
      $('#' + id).html('')
      data.map(el => {
        let domItem = `<div class="blhj-item"><span title = '${el.MC}' class="blhj-name" style="overflow: hidden;white-space: nowrap;text-overflow:ellipsis">${el.MC}</span>
        <div class="scqs-item"><div onclick="fondSC(${el.DM},'03')" class="scqs-num" style="width:${el.SCQSSL/(el.SCDBSL+el.SCQSSL)*100}%"></div>
        </div><div class="scdb-item">
        <div onclick="fondSC(${el.DM},'02')" class="scdb-num" style="width:${el.SCDBSL/(el.SCDBSL+el.SCQSSL)*100}%"></div></div>
        <span class="blhj-num"><span style="color: #128ae4;cursor:pointer" onclick="fondSC(${el.DM},'03')">
        ${el.SCQSSL}</span>/<span style="color: #2ecec7;cursor:pointer" onclick="fondSC(${el.DM},'02')">${el.SCDBSL}</span></span></div>`
        dom.innerHTML += domItem
      })
    }
  }
}
export default mixin
