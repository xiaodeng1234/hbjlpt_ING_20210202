<template>
  <div class="home">
    <div class="home_left">
      <div class="home-itemk">
        <div class="h-t-left h-t"></div>
        <div class="h-t-right h-t"></div>
        <div class="h-t-bottom h-t"></div>
        <div class="h-t-left-jiao h-t"></div>
        <div class="h-t-right-jiao h-t"></div>
        <div class="h-t-top-jiao h-t"></div>
        <div class="home-item-one">
          <div class="home-t-head-top"></div>
          <div class="home-t-o-title"><span>申请事项</span></div>
          <div class="ZXpcjks_gkzl">
           <horizontal-bar ref="horBar" :sqsxData="sqsxData"></horizontal-bar>
          </div>
          <div class="home-t-head-top"></div>
          <div class="home-t-o-title"><span>刑事案件专业类型</span></div>
          <div class="ZXpcjks_gkzl">
            <div id="ajlx"></div>
          </div>
          <div class="home-t-head-top"></div>
          <div class="home-t-o-title"><span>办理环节</span></div>
          <div class="ZXpcjks_gkzl">
            <div id="blhj"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="home_center">
      <div class="home_center_search">
        <search-form @search="search"></search-form>
      </div>
      <div class="home_center_top">
      </div>
      <div class="home_center_map"></div>
    </div>
    <div class="home_right">
      <div class="home-itemk">
        <div class="h-t-left h-t"></div>
        <div class="h-t-right h-t"></div>
        <div class="h-t-bottom h-t"></div>
        <div class="h-t-left-jiao h-t"></div>
        <div class="h-t-right-jiao h-t"></div>
        <div class="h-t-top-jiao h-t"></div>
        <div class="home-item-one">
          <div class="home-t-head-top"></div>
          <div class="home-t-o-title"><span>办理主体</span></div>
          <div class="ZXpcjks_gkzl">
            <div id="bazt"></div>
          </div>
          <div class="home-t-head-top"></div>
          <div class="home-t-o-title"><span>申请主体</span></div>
          <div class="ZXpcjks_gkzl">
            <div id="sqzt"></div>
          </div>
          <div class="home-t-head-top"></div>
          <div class="home-t-o-title"><span>申请地</span></div>
          <div class="ZXpcjks_gkzl">
            <div id="sqd"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vuex from 'vuex'
const home = vuex.createNamespacedHelpers('home')
  export default {
    name: "Home",
    data () {
      return {
        sqsxData: [],
        blhjData: [],
        xsajzylxData: [] 
      }
    },
    mounted () {
    },
    methods: {
      ...home.mapActions(['getSqsxData', 'getXsajzylxData', 'getBlhjData']),
      search (data) {
        let obj = this.initQueryData(data)
        //申请事项
        this.$api.getSqsxData(obj).then(res => {
          this.sqsxData = res.value || []
        })
        //刑事案件专业类型
        this.$api.getXsajzylxData(obj).then(res => {
          this.xsajzylxData = res.value || []
        })
        //办理环境
        this.$api.getBlhjData(obj).then(res => {
          this.blhjData = res.value || []
        })
      },
      initQueryData (data) {
        let {dwbm = '', dateRange: [startDate = '', endDate = ''], isChecked: type = true} = data 
        return { dwbm, startDate, endDate, type }
      }
    },
    computed: {
    }
  };
</script>

<style lang="scss">
@import './index.scss';
</style>
