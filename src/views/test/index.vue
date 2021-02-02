<template>
  <div style="padding: 10px">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" width="70">
        <template slot="header">目录</template>
      </el-table-column>
      <el-table-column prop="mc" label="材料名称">
      </el-table-column>
      <el-table-column prop="db" align="center" label="必要证据" class-name="red-color">
      </el-table-column>
      <el-table-column prop="qs" align="center" label="结果">
        <template slot-scope="{row}">
          <span style="color: red" v-if="row.qs === '缺'">缺少</span>
          <a v-else style="border-bottom: 1px solid #3476d2;color:#3476d2">{{row.qs}}</a>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [
        {
          mc: '《受案登记表》',
          db: '√',
          qs: '第一卷（P2）'
        },
        {
          mc: '《立案决定书》',
          db: '√',
          qs: '第一卷（P3）'
        },
        {
          mc: '《指定管辖决定书》',
          db: '√',
          qs: '缺'
        },
        {
          mc: '《拘传证》',
          db: '',
          qs: ''
        },
        {
          mc: '《拘留证》',
          db: '√',
          qs: '第一卷（P2）'
        },
        {
          mc: '《延长拘留期限通知书》',
          db: '',
          qs: ''
        },
        {
          mc: '《逮捕证》',
          db: '',
          qs: ''
        },
        {
          mc: '《取保候审决定书》',
          db: '',
          qs: ''
        },
        {
          mc: '《监视居住决定书》',
          db: '',
          qs: ''
        },
        {
          mc: '《变更羁押期限通知书》',
          db: '',
          qs: ''
        },
        {
          mc: '《到案经过/抓获说明》',
          db: '√',
          qs: '第二卷（P81）'
        },
        {
          mc: '《报案、控告、举报材料》',
          db: '',
          qs: ''
        },
        {
          mc: '《询问通知书》',
          db: '√',
          qs: '第二卷（P14）'
        },
        {
          mc: '《询问笔录》',
          db: '√',
          qs: '第二卷（P15-18）'
        },
        {
          mc: '《讯问笔录》',
          db: '√',
          qs: '第二卷（P1-13）'
        }
      ]
    }
  }
}
</script>

<style lang="scss">
.el-table {
  border: 1px solid #d1dee5 !important;
  // width: 700px !important;
  th {
    text-align: center;
  }
  td.red-color {
    color: red !important;
  }
}
</style>