<template>
  <div class="resize-layout-out-box">
    <div class="resize-layout-in-box">
      <div class="layout-container" ref="parent">
        <div class="layout-item" v-for="(item,index) in slotList" v-show="item.show" :style="getStyle(item)" :key="index">
          <div class="layout-item-content" :style="{width:item.hideSeparate?'100%':'calc(100% - 10px)'}">
            <slot :name="item.name"></slot>
          </div>
          <div class="separate-line" v-if="false" @mousedown="startResize(index)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ResizeLayout",
  data () {
    return {
      slotList: []
    }
  },
  watch: {
    layout: {
      handler (val) {
        this.slotList = []
        for (let key in this.layout) {
          this.slotList.push({
            name: key,
            ...this.layout[key]
          })
        }
        this.refreshLayout()
      }
    }
  },
  created () {
    this.slotList = []
    for (let key in this.layout) {
      this.slotList.push({
        name: key,
        ...this.layout[key]
      })
    }
    this.refreshLayout()
  },
  computed: {
    parent () {
      return this.$refs.parent
    }
  },
  methods: {
    startResize (currIndex, ev = event) {
      let curr = this.slotList[currIndex]
      let next
      for (let i = currIndex + 1; i < this.slotList.length; i++) {
        let item = this.slotList[i]
        if (item.show) {
          next = item
          break
        }
      }
      if (!next) throw new Error('发生了错误')

      let currSeparate = 10
      let nextSeparate = 10
      if (next.hideSeparate) nextSeparate = 0


      let totalWidth = this.parent.offsetWidth
      let currWidth = curr.width * totalWidth
      let nextWidth = next.width * totalWidth

      let startX = ev.screenX
      // let startY = ev.screenY
      // 添加遮罩用于拖动，防止其他元素干扰
      let div = document.createElement("div") //创建遮罩层
      div.innerHTML = `<div id="mask" style="opacity:0;top:0;left:0;bottom: 0;right: 0;background-color:rgb(0,0,0);position:absolute;z-index:9999;cursor:col-resize"></div>`
      document.querySelector("body").appendChild(div.firstChild) //向界面中添加遮罩
      let mask = document.getElementById("mask") //获取遮罩对象
      mask.onmousemove = (ev) => {
        let deltaX = ev.screenX - startX
        // let deltaY = ev.screenY - startY
        if (currWidth + deltaX < currSeparate) {
          deltaX = currSeparate - currWidth
        } else if (nextWidth - deltaX < nextSeparate) {
          deltaX = nextWidth - nextSeparate
        }

        curr.width = (currWidth + deltaX) / totalWidth
        next.width = (nextWidth - deltaX) / totalWidth
      }
      // 移除遮罩
      mask.onmouseup = () => {
        mask.parentNode.removeChild(mask) //去掉遮罩
      }
    },
    getStatus (name) {
      let item = this.slotList.find(item => item.name === name)
      if (!item) return false
      return item.show
    },
    hide (name) {
      let slot = this.slotList.find(item => item.name === name)
      if (!slot) throw new Error('请检查参数是否正确')
      slot.show = false
      let allShow = this.slotList.filter(item => item.show)

      if (!allShow.length) {
        slot.show = true
        throw new Error('最后一个不允许隐藏')
      }

      allShow.map(item => item.width += slot.width / allShow.length)
      this.refreshLayout()
    },
    show (name) {
      let slot = this.slotList.find(item => item.name === name)
      if (!slot) throw new Error('请检查参数是否正确')

      let allShow = this.slotList.filter(item => item.show)

      let allNotEnough = allShow.filter(item => item.width <= slot.width / allShow.length)

      if (allNotEnough.length) {

        let sum = allNotEnough.reduce((t, item) => {
          let w = item.width
          item.width = item.width / 2
          return t + item.width
        }, 0)
        let width = slot.width - sum

        let enough = allShow.filter(item => item.width > slot.width / allShow.length)

        enough.map(item => item.width -= width / enough.length)

      } else {
        allShow.map(item => item.width -= slot.width / allShow.length)
      }

      slot.show = true
      this.refreshLayout()
    },
    toggle (name, display) {
      if (typeof display !== 'boolean') display = !this.getStatus(name)

      if (display) {
        this.show(name)
      } else {
        this.hide(name)
      }
      this.refreshLayout()
      return display
    },
    refreshLayout () {
      this.slotList.map(item => item.hideSeparate = false)
      // 隐藏最后一个显示容器的分隔线
      for (let i = this.slotList.length - 1; i >= 0; i--) {
        let item = this.slotList[i]
        if (item.show) {
          item.hideSeparate = true
          break
        }
      }
    },
    getStyle (item) {
      let width
      if (typeof item.width === 'string') {
        width = item.width
      } else {
        width = `${item.width * 100}%`
      }
      return {
        width
      }
    }
  },
  props: {
    layout: Object
  }
}
</script>

<style scoped lang="scss">
.resize-layout-out-box {
  height: 100%;

  .resize-layout-in-box {
    height: 100%;

    .layout-container {
      height: 100%;
      position: relative;

      .layout-item {
        height: 100%;
        display: inline-block;
        vertical-align: top;
        /*box-sizing: border-box;*/
      }

      .layout-item-content {
        vertical-align: top;
        height: 100%;
        display: inline-block;
        width: calc(100% - 10px);
        & > div {
          @include css(border, 1px solid $border_color);
          @include css-theme(border-color, $slyfl_border);
          box-sizing: border-box;
        }
      }

      .separate-line {
        vertical-align: top;
        width: 10px;
        height: 100%;
        cursor: col-resize;
        position: relative;
        float: right;
        overflow: hidden;
        background-position: center;
        background-repeat: no-repeat;
      }
    }
  }
}
</style>
