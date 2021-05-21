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
    },
    title: {
      type: String,
      default: ''
    }
    
  },
  data () {
    return {
      barEchart: null
    }
  },
  created () {
  },
  watch: {
    sqsxData (val) {
      this.drowCanvas()
    } 
  },
  mounted () {
    this.barEchart = this.$echarts.init(this.$refs.char)
    window.addEventListener('resize', this.echartsResize)
    this.barEchart.getZr().on('click', (params) => {
      console.log(params, 'dad')
    })
  },
  methods: {
    echartsResize () {
      this.barEchart.resize()
    },
    drowCanvas () {
      let height = $(this.$parent.$el).find('#horBar').height()
      if(this.sqsxData.length > 5) {
        height = height + (this.sqsxData.length - 5) * 40 + 'px'
      }
      this.barEchart.resize({ height: height })
      this.barEchart.getZr().off('click')
      let option = {
        textStyle:{
          color:'#fff',
        },
        title: {
          textStyle:{
            color:'#fff',
          },
          text: '',
        },
        grid: {
            left: '2%',
            right: '2%',
            bottom: '2%',
            top: '2%',
            containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          confine:true,
          axisPointer: {
            type: 'shadow'
          },
          formatter: (params) => {
            return this.chartFormatter(params, this.title)
            // return params[0].name  + ' : ' + params[0].value
          }
        },
        xAxis: {
            show: false,
            type: 'value'
        },
        yAxis: {
            type: 'category',
            minInterval: 1,
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#48b0ff',
                    align: 'right'
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
        },
        series: this.series
      }
      this.barEchart.setOption(option)
    }
  },
  computed: {
    series () {
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
        maxBarWidth : 30,//柱子宽度
        barGap: 10,
        data: this.sqsxData
      }
    },
    xAxis () {
      let xData = []
      this.sqsxData.filter(cur => {
        xData.push(cur.mc)
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
