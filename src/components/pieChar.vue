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
  name: 'PieChar',
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
      pieEchart: null,
    }
  },
  created() {},
  watch: {
    serisesData(val) {
      this.drowCanvas()
    },
  },
  mounted() {
    this.pieEchart = this.$echarts.init(this.$refs.char)
    window.addEventListener('resize', this.echartsResize)
    this.pieEchart.getZr().on('click', (params) => {})
  },
  methods: {
    echartsResize() {
      this.pieEchart.resize()
    },
    drowCanvas() {
      let option = {
        title: {
          text: this.title,
          x: 'center',
          y: 'center',
          textStyle: {
            color: '#fff',
            fontWeight: 'bold',
          },
        },
        tooltip: {
          trigger: 'item',
          confine: true,
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        color: this.colorList,
        toolbox: {
          show: false,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: {
              show: true,
              type: ['pie', 'funnel'],
              option: {
                funnel: {
                  x: '25%',
                  width: '50%',
                  funnelAlign: 'left',
                  max: 1548,
                },
              },
            },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        calculable: true,
        series: this.series,
      }
      this.pieEchart.getZr().off('click')
      this.pieEchart.setOption(option)
    },
  },
  computed: {
    series() {
      return {
        name: this.title,
        type: 'pie',
        radius: ['40%', '60%'],
        data: this.serisesData,
        label: {
          normal: {
            show: true,
            formatter: (params) => {
              return (
                params.name +
                '\n' +
                '\n' +
                params.value +
                ' (' +
                params.percent +
                '%)'
              )
            },
          },
        },
        labelLine: {
          normal: {
            length: 20,
            length2: 5,
            lineStyle: {
              width: 1,
            },
          },
        },
      }
    }
  },
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
