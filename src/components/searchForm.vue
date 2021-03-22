<template>
  <div class="search_form">
    <div class="dw_wrap">
      <span>单位</span>
      <new-tree-select
        ref="treeSelected"
        :data="dwTree"
        :check-strictly="true"
        :defaultProps="defaultProps"
        v-model="form.dwbm"
        node-key="id"
        :expandOnClickNode="false"
      >
      </new-tree-select>
    </div>
    <div class="check_wrap">
      <el-checkbox v-model="form.isChecked">是否选择下级院</el-checkbox>
    </div>
    <div class="date_wrap">
      <span>申请时间</span>
      <el-date-picker
        v-model="form.dateRange"
        type="daterange"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
    </div>
    <div class="c-btn" @click="handleSearch"><img :src="require('/public/images/home/search.png')"/>查询</div>
  </div>
</template>

<script>
import vuex from 'vuex'
const home = vuex.createNamespacedHelpers('home')
export default {
  name: "SearchForm",
  data () {
    return {
      dwData: [],
      form: {
        dwbm: '',
        dateRange: '',
        isChecked: true
      },
      defaultProps: {
        'children': 'children',
        'label': 'text'
      }
    }
  },
  created () {
    this.getDwDate()
    this.$set(this.form, 'dwbm', this.$store.state.login.userInfo.DWBM || '')
    this.$set(this.form, 'dateRange', this.getThisYearTime() || [])
    this.handleSearch()
  },
  computed: {
    ...home.mapState(['dwTree'])
  },
  methods: {
    ...home.mapActions(['getDwDate']),
    //查询
    handleSearch () {
      if(!this.form.dwbm) {
        this.$message.warning('请选择单位！')
        return
      }
      if(this.form.dateRange == null || this.form.dateRange.length < 2 ) {
        this.$message.warning('请选择时间！')
        return 
      }
      this.$emit('search', this.form)
    }
  }
}
</script>

<style scoped lang="scss">
.search_form {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-content: center;
  color: #52aff6;
  & > div {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .dw_wrap {
    width: 25%;
    // /deep/ .treeSelect_div.treeSelect_div_radio {
    //   height: 34px !important;
    // }
    & > span {
      float: left;
      width: 40px;
    }
    & > div {
      float: left;
      /deep/.el-input.el-input--suffix > .el-input__inner {
        background: rgba(18,78,138,0.3);
        border-color: #3aa4e7;
      }
    }
  }
  .check_wrap {
    /deep/.el-checkbox .el-checkbox__label {
      color: #52aff6 !important;
    }
    /deep/.el-checkbox__input.is-checked .el-checkbox__inner {
      border-color: #3aa4e7;
      background-color: #3aa4e7;
    }
  }
  .date_wrap {
    width: calc(75% - 280px);
    & > span {
      float: left;
      width: 80px;
    }
    & > div {
      float: left;
      width: 100%;
    }
  }
  .c-btn {
    width: 110px;
    height: 30px;
    margin-top: 7px;
    min-width: 80px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url('/images/home/btn.png') no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
    &:hover {    
      background: url('/images/home/btn-.png') no-repeat;
      background-size: 100% 100%;
    }
    img {
      margin: 0 5px -2px 0;
    }
  }
}
</style>
<style lang="scss">
</style>
