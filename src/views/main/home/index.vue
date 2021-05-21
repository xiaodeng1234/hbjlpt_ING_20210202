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
           <horizontal-bar ref="horBar" :sqsxData="sqsxData" id="horBar" title="申请事项"></horizontal-bar>
          </div>
          <div class="home-t-head-top"></div>
          <div class="home-t-o-title"><span>刑事案件专业类型</span></div>
          <div class="ZXpcjks_gkzl">
            <pie-char :serisesData="xsajData" :title="'刑事案件' + '\n' + '专业类型'"></pie-char>
          </div>
          <div class="home-t-head-top"></div>
          <div class="home-t-o-title"><span>办理环节</span></div>
          <div class="ZXpcjks_gkzl">
            <div style="width: 100%;height: 30px;float: left;line-height: 30px;">
              <div style="width: 10px;height: 10px;float: left;background: #128ae4;border-radius: 1px;
              margin: 10px 5px 0 20px;"></div>
              <span style="float: left">审查起诉</span>
              <div style="width: 10px;height: 10px;float: left;background: #2ecec7;border-radius: 1px;
              margin: 10px 5px 0 20px;"></div>
              <span style="float: left">审查逮捕</span>
            </div>
            <div id="blhj" style="height: calc(100% - 30px);"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="home_center">
      <div class="home_center_search">
        <search-form @search="search"></search-form>
      </div>
      <div class="home_center_top">
        <div v-for="(item, index) in sqzlData" :key="index">
          <span class="sqzl_name">{{ item.name }}</span>
          <br>
          <span class="sqzl_value">{{ item.value }}</span>
          <span class="sqzl_dw">{{ item.dw }}</span>
        </div>
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
            <bar-char :serisesData="sqztData" title="申请主体"></bar-char>
          </div>
          <div class="home-t-head-top"></div>
          <div class="home-t-o-title"><span>申请地</span></div>
          <div class="ZXpcjks_gkzl">
            <pie-char :serisesData="sqdData" title="申请地"></pie-char>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vuex from 'vuex'
import BarChar from '../../../components/barChar.vue';
import pieChar from '../../../components/pieChar.vue';
const home = vuex.createNamespacedHelpers('home')
  export default {
  components: { pieChar, BarChar },
    name: "Home",
    data () {
      return {
        sqsxData: [],
        blhjData: [],
        xsajData: [],
        sqzlData: [],
        sqztData: [],
        sqdData: []
      }
    },
    mounted () {
    },
    methods: {
      search (data) {
        let obj = this.initQueryData(data)
        //申请事项
        this.getSqsxData (obj)
        //刑事案件专业类型
        this.getXsajzylxData (obj)
        //办理环节
        this.getBlhjData (obj)
        //办理总览
        this.getBlzlData (obj)
        //申请主体
        this.getSqztData (obj)
        //申请地
        this.getSqdData (obj)
      },
      initQueryData (data) {
        let {dwbm = '', dateRange: [startDate = '', endDate = ''], isChecked: type = true} = data 
        return { dwbm, startDate, endDate, type }
      },
      //申请事项
      getSqsxData (obj) {
        this.$api.getSqsxData(obj).then(res => {
          let yDatas = [], copyObj = {}
          res.value.map(cur => {
            if (cur.MC != null && cur.MC != "") {
              if(cur.MC !== '其他事项') {
                yDatas.push({value: cur.SL, dm: cur.DM, mc: cur.MC});
              } else {
                copyObj = {value: cur.SL, dm: cur.DM, mc: cur.MC}
              }
            }
          })
          if(copyObj.dm) {
            yDatas.unshift(copyObj)
          }
          this.sqsxData = yDatas || []
        })
      },
      //刑事案件专业类型
      getXsajzylxData (obj) {
        this.$api.getXsajzylxData(obj).then(res => {
          if (res.value.length > 0) {
             res.value = res.value.map(cur => {
              let obj = {
                name: cur.LB,
                value: cur.SL,
                zmjc: cur.ZMJC
              }
              return obj
            })
          }
          this.xsajData = res.value
        })
      },
      //办理环节
      getBlhjData (obj) {
        this.$api.getBlhjData(obj).then(res => {
          this.blhjData = res.value || []
          this.drawBlhjChar('blhj',this.blhjData)
        })
      },
      getBlzlData (obj) {
        this.$api.getBlqkzl(obj).then(res => {
          this.sqzlData = [{name: '申请总数量', value: 0, dw: '（次）'}, {name: '同意申请数量', value: 0, dw: '（次）'}, {name: '不同意申请数量', value: 0, dw: '（次）'},{name: '待处理数量', value: 0, dw: '（次）'}, {name: '检察官人数', value: 0, dw: '（人）'}, {name: '服务律师人数', value: 0, dw: '（人）'}, {name: '律所数量', value: 0, dw: '（所）'}, {name: '律师平均申请数', value: 0, dw: '（次）'}]
          let data = res.value || []
          data.map(cur => {
            switch (cur.NAME) {
              case '同意申请':
                this.sqzlData[1].value = cur.SL;
                break;
              case '不同意申请':
                this.sqzlData[2].value = cur.SL;
                break;
              case '在办':
                this.sqzlData[3].value = cur.SL;
                break;
              case '检察官数量':
                this.sqzlData[4].value = cur.SL;
                break;
              case '服务律师人数':
                this.sqzlData[5].value = cur.SL;
                break;
              case '律所数量':
                this.sqzlData[6].value = cur.SL;
                break;
            }
          })
          this.sqzlData[0].value = this.sqzlData[1].value + this.sqzlData[2].value + this.sqzlData[3].value
          this.sqzlData[7].value = (this.sqzlData[0].value / this.sqzlData[5].value).toFixed(2)
        })
      },
      getSqztData (obj) {
        let yDatas = []
        this.$api.getSqztData(obj).then(res => {
          res.value.map(cur => {
            yDatas.push({name: cur.MC, value: cur.SL, dm: cur.DM})
          })
            this.sqztData = yDatas || []
        })
      },
      getSqdData (obj) {
        this.$api.getSqdData(obj).then(res => {
          let yData = []
          res.value.map(cur => {
            yData.push({name: cur.MC, value: cur.SL, dm: cur.DM})
          })
          this.sqdData = yData || []
        })
      }
    },
    computed: {
    }
  };
</script>

<style lang="scss">
@import './index.scss';
</style>
