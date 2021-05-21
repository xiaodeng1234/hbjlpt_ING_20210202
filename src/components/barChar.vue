<template>
  <div class="bar_char">
    <div class="bar_wrap">
      <div ref="chars" class="char"></div>
    </div>
  </div>
</template>

<script>
import vuex from 'vuex'
export default {
  name: 'barChar',
  props: {
    barWidth: {
      type: [Number, String],
      default: () => 20,
    },
    serisesData: {
      type: Array,
      default: () => [],
    },
    colorList: {
      type: Array,
      default: () => ['#1189E5', '#6A8EDE', '#99B348', '#2BCDCB'],
    },
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      barEchart: null,
    }
  },
  created() {},
  watch: {
    serisesData(val) {
      this.drowCanvas()
    },
  },
  mounted() {
    this.barEchart = this.$echarts.init(this.$refs.chars)
    window.addEventListener('resize', this.echartsResize)
    this.barEchart.getZr().on('click', (params) => {})
  },
  methods: {
    echartsResize() {
      this.barEchart.resize()
    },
    drowCanvas() {
      let option = {
        tooltip: {
          trigger: 'axis',
          confine:true,
          axisPointer: {
              type: 'shadow'
          },
          formatter: (params) => {
            return this.chartFormatter(params, this.title)
          }
        },
        color: this.colorList,
        grid:{
          left:'15%',
          top:"15%",
          bottom:"28%"
        },
        xAxis: {
          data: this.xDatas,
          axisLabel: {
            textStyle: {
              fontFamily: 'Microsoft YaHei',
              color: "#48b0ff",
            },
            interval:0,
            formatter: (value) => {
              return this.hideTextFormatter(value ,4)
            }
          },
          axisLine: {
            lineStyle: {
              color: '#063355'
            }
          }
        },
        yAxis: {
          minInterval: 1,
          axisLabel: {
            textStyle: {
              fontFamily: 'Microsoft YaHei',
              color: "#48b0ff"
            }
          },
          axisLine: {
            lineStyle: {
              color: '#063355'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#063355'
            }
          }
        },
        series: this.series
      }
      this.barEchart.setOption(option)
    },
  },
  computed: {
    series() {
      return {
        type: 'bar',
        itemStyle: {
          normal: {
            label: {
              show: true,
              position: 'top'
            },
          }
        },
        barWidth: this.barWidth,
        data: this.serisesData
      }
    },
    xDatas () {
      let xData = []
      this.serisesData.map(cur => {
        xData.push(cur.name)
      })
      return xData
    }
  },
}
</script>

<style scoped lang="scss">
.bar_char {
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
