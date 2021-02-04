<template>
  <div class="login_wrapper">
    <div class="bg-bac">
      <div class="login-div">
        <img src="/images/login/logo.png" class="login_img"/>
        <div class="in-input">
          <img src="/images/login/unit.png" class="login_icon"/>
          <new-tree-select :data="dwData" ref="treeSelectedInput" :defaultProps="defaultProps" style="width: 80%;" class="login-dw"
            :expand-on-click-node="true" node-key="id" v-model="login.dwbm" placeholder="单位"></new-tree-select>
        </div>
        <div class="in-input">
          <img src="/images/login/user.png" class="login_icon"/>
          <el-input @keyup.enter.native="signIn(login)" class="login-dw" v-model="login.name" placeholder="姓名"></el-input>
        </div>
        <div class="in-input">
          <img src="/images/login/pwd.png" class="login_icon"/>
          <el-input @keyup.enter.native="signIn(login)" type="password" class="login-dw" v-model="login.pwd" placeholder="密码"></el-input>
        </div>
        <div class="login-btn" @click="signIn(login)">登 录</div>
      </div>
    </div>
  </div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions } = createNamespacedHelpers('login')
export default {
  name: 'login',
  data() {
    return {
      defaultProps: {
        label: 'text',
        children: 'children'
      },
      login: {
        name: '',
        dwbm: '',
        pwd: ''
      }
    }
  },
  created() {
    this.getDwTree()
  },
  mounted() {
  },
  beforeDestroy () {
  },
  components: {
  },
  computed: {
    ...mapState(['loginDwData']),
    dwData () {
      return this.loginDwData
    }
  },
  methods: {
    ...mapActions(['getDwTree', 'signIn']),
  },
}
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
