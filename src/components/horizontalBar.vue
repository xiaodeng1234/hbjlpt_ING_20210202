<template>
  <div class="horizontal_bar">
     <div class="bar_wrap">
       <div ref="char" class="char"></div>
     </div>
  </div>
</template>

<script>
import vuex from 'vuex'
export default {
  name: "HorizontalBar",
  props: {
    barWidth: {
      type: [Number, String],
      default: () => 20
    },
    sqsxData: {
      type: Array,
      default: () => []
    },
    colorList: {
      type: Array,
      default: () => ['#1189E5', '#ccecff', '#F45B5B']
    }
    
  },
  data () {
    return {
      barEchart: null,
    }
  },
  created () {
  },
  watch: {
    sqsxData (val) {
      console.log(val, 'a')
      this.drowCanvas()
    } 
  },
  mounted () {
    this.barEchart = this.$echarts.init(this.$refs.char)
    window.addEventListener('resize', this.echartsResize)
  },
  methods: {
    echartsResize () {
      this.barEchart.resize()
    },
    drowCanvas () {
      let option = {
        backgroundColor:"#003366",
        grid: {
            left: '2%',
            right: '2%',
            bottom: '2%',
            top: '2%',
            containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none'
          },
          formatter: function(params) {
            // return params[0].name  + ' : ' + params[0].value
          }
        },
        xAxis: {
            show: false,
            type: 'value'
        },
        yAxis: [{
            type: 'category',
            inverse: true,
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#fff'
                },
            },
            splitLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            data: this.xAxis
        }],
        series: this.series
      }
      this.barEchart.setOption(option)
    }
  },
  computed: {
    series () {
      let yDatas = [], copyObj = {}
      this.sqsxData.map(cur => {
        if (cur.MC != null && cur.MC != "") {
          if(cur.MC !== '其他事项') {
            yDatas.push({value: cur.SL, dm: cur.DM, mc: cur.MC});
          } else {
            copyObj = cur
          }
        }
      })
      if(copyObj.dm) {
        yDatas.unshift(copyObj)
      }
      return {
        type: 'bar',
        itemStyle : {
          normal : {
            color: this.colorList[0],
            label : {
              textStyle : {
                color: this.colorList[1]
              }
            }
          }
        },
        label : {
          normal : {
            show : true,//显示数字
            position : 'right'
          }
        },
        barWidth: this.barWidth,
        data: yDatas
      }
    },
    xAxis () {
      let xData = [], copyName = ''
      this.sqsxData.filter(cur => {
        if (cur.MC != null && cur.MC != "") {
          xData.push(cur.MC)
          // if(cur.MC === '其他事项')
        }
      })
      return xData
    }   
  }
}
</script>

<style scoped lang="scss">
.horizontal_bar {
  height: calc(100% - 10px);
  width: calc(100% - 10px);
  margin: 5px;
  .bar_wrap {
    width: 100%;
    height: 100%;
    & > div {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
<style lang="scss">
</style>
