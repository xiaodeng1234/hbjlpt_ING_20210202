<template>
  <div class="header_bar">
      <div class="header_left">
        <img :src="logoImg"/>
      </div>
      <div class="header_center">
        <el-menu
          :default-active="this.$route.path"
          class="el-menu-vertical-demo"
          background-color="#021a35"
          text-color="#8dd2fc"
          active-background-color="#2283e1"
          active-text-color="#FFFFFF"
          router
          mode="horizontal"
          style="background-color:transparent;color:white;width: 100%"
        >
          <template v-for="(item, index) in menuList">
            <el-submenu
              :index="String(index)"
              v-if="item.functionList && item.functionList.length > 0"
              :key="item.id"
            >
              <template slot="title">
                <!-- <i :class="item.icon" class="meauImg"></i> -->
                <span>{{ item.text }}</span>
              </template>
              <div class="s-t-l s-t"></div>
              <div class="s-t-r s-t"></div>
              <div class="s-t-b s-t"></div>
              <div class="s-t-lj s-t"></div>
              <div class="s-t-rj s-t"></div>
              <el-menu-item
                v-for="ele in item.functionList"
                :key="ele.id"
                :index="ele.gnct"
                >{{ ele.text }}</el-menu-item
              >
            </el-submenu>
            <el-menu-item :index="item.gnct" v-else :key="item.id">
              <!-- <i :class="item.icon" class="meauImg" v-if="item.id === 4 || (personinfo.dwbm && personinfo.dwbm.endsWith('0000'))"></i> -->
              <span>{{ item.text }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </div>
      <div class="header_right">
        <div @click="backToLogin" class="header_right_back"></div>
        <div class="header_right_user">
        </div>
        <div class="header_right_close"></div>
      </div>
  </div>
</template>

<script>
import vuex from 'vuex'
import { mapState } from 'vuex'
export default {
  name: "HeaderBar",
  data () {
    return {
      logoImg: require('/public/images/header/logo.png'),
      activeIndex: '0'
    }
  },
  watch: {
  },
  created () {
  },
  mounted () {
    console.log(this.menuList)
  },
  computed: {
    ...mapState(['menuList'])
  },
  methods: {
    // 返回登录页面
    backToLogin () {
      this.$confirm('您确定想要退出吗？', '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push('/login')
      })
    }
  }
}
</script>

<style scoped lang="scss">
.header_bar {
  height: 100px;
  width: 100%;
  & > div {
    height: 100%;
    float: left;
  }
  & > .header_left {
    width: 423px;
    @include bgImage('/header/01.jpg');
    & > img {
      margin: 11px 15px;
    }
  }
  & > .header_center {
    width: calc(100% - 760px);
    @include bgImage('/header/02.jpg');
    .el-menu {
      height: 68px;
      &.el-menu--horizontal {
        border-bottom-color: transparent;
        & > .el-menu-item.is-active {
          border-bottom: none;
          @include bgImage('/header/checked.png');
        }
      }
    }
    /deep/ .el-menu--horizontal>.el-submenu {
      // &.is-opened {
      //   background: red !important;
      //   & > div {
      //     background: red !important;
      //   }
      // }
      .el-submenu__title {
        @include menuItem();
      }
    }
    /deep/ .el-menu-item {
      border-bottom: none;
      @include menuItem();
    }
  }
  & > .header_right {
    width: 337px;
    height: 103px;
    @include bgImage('/header/04.jpg');
    background-size: 101.6% 100%;
    & > div {
      float: right;
      width: 29px;
      height: 28px;
      margin: 12px 18px 0 2px;
      cursor: pointer;
      &:first-child {
        @include bgImage('/header/close.png');
        &:hover {
          @include bgImage('/header/close-hover.png');        
        }
      }
      &:nth-child(2) {
        @include bgImage('/header/user.png');
        &:hover {
          @include bgImage('/header/user-hover.png');        
        }
      }
      &:last-child {
        @include bgImage('/header/back.png');
        &:hover {
          @include bgImage('/header/back-hover.png');        
        }
      }
    }
  }
}
</style>
<style lang="scss">
</style>
