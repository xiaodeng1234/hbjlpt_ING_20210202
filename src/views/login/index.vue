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
          <el-input @keyup.enter.native="loginMethod" v-focus class="login-dw" v-model="login.name" placeholder="姓名"></el-input>
        </div>
        <div class="in-input">
          <img src="/images/login/pwd.png" class="login_icon"/>
          <el-input @keyup.enter.native="loginMethod" type="password" class="login-dw" v-model="login.pwd" placeholder="密码"></el-input>
        </div>
        <div class="login-btn" @click="loginMethod">登 录</div>
      </div>
    </div>
  </div>
</template>
<script>
import Cookies from 'js-cookie'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions, mapMutations } = createNamespacedHelpers('login')
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
    // 从Cookie拿取登录信息
    if (Cookies.get('loginMsg')) {
      let { DWBM, MC } = Cookies.getJSON('loginMsg')
      this.login.dwbm = DWBM
      this.login.name = MC
    }
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
    ...mapActions(['getDwTree', 'signIn', 'getFuncationList']),
    ...mapMutations(['SAVE_LOGIN_INFO']),
    // 登录
    async loginMethod () {
      let { name: username, dwbm, pwd: password} = this.login
      if(!username) {
        this.$Message.error('请输入用户名！')
        return
      }
      if (!dwbm) {
        this.$Message.error('请选择单位！') 
        return
      }
      if (!password) {
        this.$Message.error('请输入密码！') 
        return
      }
      let responseData = await this.signIn(this.login)
      if(responseData.status === 200) {
        // 保存到cookie
        Cookies.set(
          'loginMsg', responseData.value,
          {
            expires: 9999
          }
        )
        // 保存登录信息到vuex
        this.SAVE_LOGIN_INFO(responseData.value || {})
        this.getFuncationList()
        this.$router.push('/home')
      }
    }
  },
}
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
