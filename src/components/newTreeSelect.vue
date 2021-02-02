<template>
  <div
    :style="{ width: width }"
    :class="multiple ? 'treeSelect_div_multiple' : 'treeSelect_div_radio'"
    class="treeSelect_div"
  >
    <!-- `treeSelect_div${uuid}` -->
    <el-popover
      v-model="isShowSelect"
      popper-class="treeSelect_popover"
      placement="bottom-start"
      trigger="manual"
    >
      <a-input-search
        v-if="remoteSearch && filterText"
        v-model="filterText"
        class="min_width150"
        :placeholder="filterPlaceholder"
        :style="{ width: selectWidth }"
        @search="onSearch"
      >
        <a-button
          slot="enterButton"
          class="searchBtn"
          type="primary"
          icon="search"
          style="height: 34px"
        >
          {{ remoteSearchText }}
        </a-button>
      </a-input-search>
      <div v-else>
        <el-checkbox
          v-if="multiple && showAllSelection"
          v-model="allSelection"
          :disabled="!data || data.length == 0"
          style="margin: 0 10px;"
          @change="allSelectionFun"
          >全选</el-checkbox
        >
        <a-input
          v-model="filterText"
          class="min_width150"
          :style="{
            width:
              multiple && showAllSelection
                ? `calc(${selectWidth} - 90px)`
                : selectWidth
          }"
          :placeholder="filterPlaceholder"
        ></a-input>
      </div>
      <div
        :style="style"
        :class="{
          min_width150: true,
          min_width228: multiple && showAllSelection
        }"
      >
        <el-tree
          v-if="
            suggestKeys &&
              suggestKeys.length > 0 &&
              suggestTree &&
              suggestTree.length > 0 &&
              !filterText
          "
          ref="suggest_tree"
          class="suggest_tree"
          :data="suggestTree"
          :props="suggestProps"
          :show-checkbox="multiple"
          :node-key="nodeKey"
          :check-strictly="true"
          :default-expand-all="true"
          :expand-on-click-node="expandOnClickNode"
          :check-on-click-node="multiple"
          :highlight-current="false"
          @node-click="handleNodeClick1"
          @check-change="handleCheckChange1"
        ></el-tree>
        <el-tree
          ref="treeSelect_tree"
          class="treeSelect_tree"
          :data="data"
          :props="defaultProps"
          :show-checkbox="multiple"
          :node-key="nodeKey"
          :check-strictly="checkStrictly"
          :default-expand-all="defaultExpandAll"
          :default-expanded-keys="defaultExpandedKeys"
          :expand-on-click-node="expandOnClickNode"
          :check-on-click-node="multiple"
          :filter-node-method="treeFilterNode"
          :render-content="renderContentFun"
          :highlight-current="true"
          @node-click="handleNodeClick"
          @check-change="handleCheckChange"
        ></el-tree>
      </div>
      <el-select
        slot="reference"
        ref="treeSelect_select"
        v-model="selectValue"
        :placeholder="placeholder"
        :size="size"
        :disabled="readonly || disabled"
        :multiple="multiple"
        :clearable="clearable"
        :collapse-tags="collapseTags"
        class="treeSelect_select"
        :class="{
          treeSelect_select_expand: isShowSelect,
          tags__collapse_tags: collapseTags,
          treeSelect_select_disabled: disabled,
          treeSelect_select_readonly: !disabled && readonly
        }"
        @click.native="selectClick"
        @remove-tag="removeSelectedNodes"
        @clear="treeClear"
        @change="changeSelectedNodes"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'TreeSelect',
  model: {
    prop: 'treeSelectValue',
    event: 'returnBack'
  },
  props: {
    // 树结构数据
    data: {
      type: Array,
      default() {
        return []
      }
    },
    defaultProps: {
      type: Object,
      default() {
        return {}
      }
    },
    // 配置是否可多选
    multiple: {
      type: Boolean,
      default() {
        return false
      }
    },
    // 配置是否可清空选择
    clearable: {
      type: Boolean,
      default() {
        return true
      }
    },
    // 配置多选时是否将选中值按文字的形式展示
    collapseTags: {
      type: Boolean,
      default() {
        return false
      }
    },
    // 配置多选并且遵循父子不互相关联时是否打开批量反选
    batchReverseElection: {
      type: Boolean,
      default() {
        return false
      }
    },
    nodeKey: {
      type: String,
      default() {
        return 'id'
      }
    },
    // 显示复选框情况下，是否严格遵循父子不互相关联
    checkStrictly: {
      type: Boolean,
      default() {
        return false
      }
    },
    expandOnClickNode: {
      type: Boolean,
      default() {
        return true
      }
    },
    // 建议数据key数组
    suggestKeys: {
      type: Array,
      default() {
        return []
      }
    },
    size: {
      type: String,
      default() {
        return 'small'
      }
    },
    width: {
      default() {
        return '195px'
      }
    },
    height: {
      default() {
        return '240px'
      }
    },
    // 禁用组件
    disabled: {
      type: Boolean,
      default() {
        return false
      }
    },
    // 组件只读
    readonly: {
      type: Boolean,
      default() {
        return false
      }
    },
    // 是否默认展开所有节点
    defaultExpandAll: {
      type: Boolean,
      default() {
        return false
      }
    },
    // 默认展开的节点的 key 的数组
    defaultExpandedKeys: {
      type: Array,
      default() {
        return []
      }
    },
    // 是否支持远程检索
    remoteSearch: {
      type: Boolean,
      default() {
        return false
      }
    },
    // 远程检索按钮文字
    remoteSearchText: {
      type: String,
      default() {
        return '检索更多'
      }
    },
    // 自定义节点
    renderContent: {
      type: Function
    },
    // 远程数据源
    remoteData: {
      type: Array,
      default() {
        return []
      }
    },
    // 请选择
    placeholder: {
      type: String,
      default() {
        return '请选择'
      }
    },
    // 过滤输入框提示文字
    filterPlaceholder: {
      type: String,
      default() {
        return '输入关键字进行过滤'
      }
    },
    // 展示全选按钮
    showAllSelection: {
      type: Boolean,
      default() {
        return false
      }
    },
    treeSelectValue: {
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      isShowSelect: false, // 是否显示树状选择器
      options: [],
      selectValue: '', // 选中的节点
      selectClientWidth: '',
      checkedIds: [],
      checkedData: [],
      filterText: '',
      suggestTree: [],
      suggestProps: {},
      bFilterResult: true, // 检索是否取到值
      allSelection: false // 是否全选
      // uuid: ''
    }
  },
  computed: {
    style() {
      return (
        'width: ' +
        this.selectWidth +
        ';height:' +
        this.height +
        ';overflow: auto;padding: 10px;'
      )
    },
    selectWidth() {
      return typeof this.width == 'string'
        ? this.width.indexOf('%') && this.selectClientWidth
          ? this.selectClientWidth
          : this.width
        : this.width + 'px'
    }
  },
  watch: {
    isShowSelect(val) {
      if (this.multiple) {
        const idArr = []
        const dataArr = []
        const checkedIds = this.$refs.treeSelect_tree.getCheckedKeys() // 所有被选中的节点的 key 所组成的数组数据
        const checkedData = this.$refs.treeSelect_tree.getCheckedNodes() // 所有被选中的节点所组成的数组数据
        if (checkedIds && checkedIds.length) {
          checkedIds.forEach(item => {
            const node = this.$refs.treeSelect_tree.getNode(item)
            if (node && !node.disabled) {
              idArr.push(item)
              dataArr.push(node.data)
            }
          })
        }
        this.checkedIds = idArr
        this.checkedData = dataArr
      } else {
        const checkedIds = this.$refs.treeSelect_tree.getCurrentKey()
        const checkedData = this.$refs.treeSelect_tree.getCurrentNode()
        if (checkedIds) {
          const node = this.$refs.treeSelect_tree.getNode(checkedIds)
          if (node && !node.disabled) {
            this.checkedIds = checkedIds
            this.checkedData = checkedData
          }
        }
      }
      if (val) {
        this.$emit('popoverShow', this.checkedIds, this.checkedData)
      } else {
        this.$emit('popoverHide', this.checkedIds, this.checkedData)
      }
      // 隐藏select自带的下拉框
      const popover = document.getElementsByClassName('treeSelect_popover')
      for (let i = 0; i < popover.length; i++) {
        if (!popover[i].style.display) {
          popover[i].style.display = 'none'
        }
      }
      this.selectClientWidth =
        this.$refs.treeSelect_select.$el.clientWidth - 2 + 'px'
      this.$refs.treeSelect_select.blur()
      this.filterText = ''
    },
    // 双向绑定值发生改变
    treeSelectValue(val, oldValue) {
      if (
        JSON.stringify(val) === JSON.stringify(oldValue) ||
        this.data.length == 0
      ) {
        return
      }
      this.init()
    },
    data(data) {
      this.init()
    },
    filterText(val) {
      this.bFilterResult = false
      this.$refs.treeSelect_tree.filter(val)
    },
    selectValue(val, oldValue) {
      if (oldValue === val) {
        return
      }
      if (!oldValue || !val) {
        // 抛出change
        this.emitChange()
        return
      }
      if (val instanceof Array) {
        if (oldValue.length === val.length) {
          for (let i = 0; i < oldValue.length; i++) {
            const tmp = oldValue[i]
            if (val.indexOf(tmp) < 0) {
              // 抛出change
              this.emitChange()
              break
            }
          }
        } else {
          this.emitChange()
        }
      } else {
        this.emitChange()
      }
    },
    suggestKeys(val) {
      if (!val) return
      this.initCheckedData()
    },
    // 监听远程数据源
    remoteData(arr) {}
  },
  mounted() {
    // this.uuid = this.$UUID()
    if (this.data.length > 0) {
      this.init()
    }
    // this.initCheckedData()
    window.addEventListener('click', this.popoverHideAction, false)
  },
  beforeDestroy() {
    window.removeEventListener('click', this.popoverHideAction, false)
  },
  methods: {
    // 收起下拉框
    popoverHideAction(e) {
      // if (e.path[0].className !== `treeSelect_div${this.uuid}`) {
      //   this.isShowSelect = false
      // }
      if (e.path[0].className !== 'treeSelect_div') {
        this.isShowSelect = false
      }
    },
    // 展开与收起
    selectClick(e) {
      // const self = this
      // const treeSelect = document.getElementsByClassName('treeSelect_div')
      // for (let i = 0; i < treeSelect.length; i++) {
      //   if (treeSelect[i].className.indexOf(this.uuid) < 0) {
      //   }
      // }
      if (!this.disabled && !this.readonly) {
        this.isShowSelect = !this.isShowSelect
      }
    },
    init() {
      // 多选
      this.$nextTick(() => {
        // 常用数据源初始化
        this.suggestInit()
        if (this.multiple) {
          if (
            this.treeSelectValue &&
            Array.isArray(this.treeSelectValue) &&
            this.treeSelectValue.length > 0
          ) {
            // 设置树当前勾选
            this.checkCurrentNodes(this.treeSelectValue)
          } else {
            // 清空勾选
            this.clear()
          }
        } else {
          // 单选
          if (this.treeSelectValue && typeof this.treeSelectValue == 'string') {
            // 设置树当前选中
            this.checkCurrentNode(this.treeSelectValue)
          } else {
            // 清空选中
            this.clear()
          }
        }
      })
    },
    // 常用数据源初始化
    suggestInit() {
      const suggestArr = []
      if (this.suggestKeys && this.suggestKeys.length > 0) {
        this.suggestProps = { ...this.defaultProps }
        this.suggestProps.disabled = this.disabledFn
        this.suggestKeys.forEach(e => {
          const node = this.$refs.treeSelect_tree.getNode(e)
          if (node) {
            const newNode = JSON.parse(JSON.stringify(node.data))
            newNode[this.defaultProps.children] = []
            newNode[this.defaultProps.pid] = '000'
            suggestArr.push(newNode)
          }
        })
        // 如果找到了建议数据就添加一个'常用'父节点
        if (suggestArr.length !== 0) {
          const obj = {}
          obj[this.defaultProps.id] = '000'
          obj[this.defaultProps.pid] = null
          obj[this.defaultProps.label] = '常用'
          obj.common = true
          suggestArr.push(obj)
        }
        if (suggestArr && suggestArr.length > 0) {
          this.suggestTree = this.$listToTree(
            suggestArr,
            this.defaultProps.id,
            this.defaultProps.pid
          )
        }
      }
    },
    // 设置树当前选中  单选
    checkCurrentNode(value) {
      // 获取当前选中节点的node
      const node = this.$refs.treeSelect_tree.getNode(value)
      if (node) {
        if (!node.disabled) {
          this.$refs.treeSelect_tree.setCurrentKey(value)
          // 设置下拉框的option
          this.setSelectOption(node)
        } else {
          this.$emit('returnBack', this.selectValue)
        }
      }
    },
    // 设置树当前勾选  多选
    checkCurrentNodes(checkedKeys) {
      // 获取当前选中节点的node
      this.$refs.treeSelect_tree.setCheckedKeys([])
      checkedKeys.forEach(e => {
        const node = this.$refs.treeSelect_tree.getNode(e)
        if (node) {
          if (!node.disabled) {
            this.$refs.treeSelect_tree.setChecked(e, true, !this.checkStrictly)
          }
        }
      })
      if (this.$refs.suggest_tree)
        this.$refs.suggest_tree.setCheckedKeys(checkedKeys)
      this.$nextTick(() => {
        this.handleCheckChange()
        this.handleCheckChange1()
      })
    },
    // 单选时点击tree节点，设置select选项
    setSelectOption(node) {
      if (node) {
        const tmpMap = {}
        tmpMap.value = node.key
        tmpMap.label = node.label ? node.label : ''
        this.options = []
        this.options.push(tmpMap)
        // 设置下拉框的值
        this.$nextTick(() => {
          this.selectValue = node.key
          this.$emit('returnBack', this.selectValue)
        })
      }
    },
    // 单选,清空select输入框的回调
    treeClear() {
      // 单选，清空选中
      this.clear()
      // 抛出clear
      this.$emit('clear')
    },
    // 选中值变化时抛出change事件，返回选中id值和选中节点数据
    emitChange() {
      const checkedData = this.multiple
        ? this.$refs.treeSelect_tree.getCheckedNodes()
        : this.$refs.treeSelect_tree.getCurrentNode()
        ? this.$refs.treeSelect_tree.getCurrentNode()
        : ''
      this.$emit('change', this.selectValue, checkedData)
    },
    // 设置选中节点数据
    setCurrentNode(data) {
      this.$refs.treeSelect_tree.setCurrentNode(data)
    },
    // 单选，节点被点击时的回调,返回被点击的节点数据
    handleNodeClick(data, node) {
      if (!node.disabled) {
        if (!this.multiple) {
          this.setSelectOption(node)
          this.isShowSelect = !this.isShowSelect
        }
        this.$emit('node-click', data, node)
      }
    },
    // 单选，节点被点击时的回调,返回被点击的节点数据(建议数据树)
    handleNodeClick1(data, node, event) {
      if (this.$refs.suggest_tree && !data.common) {
        const suggestNode = this.$refs.suggest_tree.getCurrentNode() // 所有被选中的节点的 key 所组成的数组数据
        this.$refs.treeSelect_tree.setCurrentNode(suggestNode)
        this.handleNodeClick(data, node, event, suggestNode)
      }
    },
    // 多选，节点勾选状态发生变化时的回调
    handleCheckChange(data, checked, indeterminate) {
      const checkedKeys = this.$refs.treeSelect_tree.getCheckedKeys() // 所有被选中的节点的 key 所组成的数组数据
      if (this.$refs.suggest_tree)
        this.$refs.suggest_tree.setCheckedKeys(checkedKeys) // 所有被选中的节点对应的node
      this.options = []
      checkedKeys.forEach(item => {
        const node = this.$refs.treeSelect_tree.getNode(item) // 所有被选中的节点对应的node
        if (node && !node.disabled) {
          const tmpMap = {}
          tmpMap.value = node.key
          tmpMap.label = node.label
          this.options.push(tmpMap)
        }
      })
      this.$nextTick(() => {
        this.selectValue = this.options.map(item => {
          return item.value
        })
        this.$emit('returnBack', this.selectValue)
      })
      // this.$emit('change', this.selectValue)
    },
    // 多选，节点勾选状态发生变化时的回调
    handleCheckChange1() {
      if (this.$refs.suggest_tree) {
        const checkedKeys = this.$refs.suggest_tree.getCheckedKeys() // 所有被选中的节点的 key 所组成的数组数据
        checkedKeys.forEach(e => {
          const node = this.$refs.treeSelect_tree.getNode(e)
          if (node) {
            if (!node.disabled) {
              this.$refs.treeSelect_tree.setChecked(
                e,
                true,
                !this.checkStrictly
              )
            }
          }
        })
      }
      // this.$emit('change', this.selectValue)
    },
    // 获取当前下拉树的节点node数据（传数据源data||key值）
    getNode(data) {
      return this.$refs.treeSelect_tree.getNode(data)
    },
    // 获取当前选中节点（单选{}多选[]）
    getCurrentNode() {
      let checkedData
      if (this.multiple) {
        // 所有被选中的节点所组成的数组数据
        checkedData = this.$refs.treeSelect_tree
          .getCheckedNodes()
          .filter(item => {
            const node = this.$refs.treeSelect_tree.getNode(item)
            if (node && !node.disabled) {
              return item
            }
          })
      } else {
        checkedData = this.$refs.treeSelect_tree.getCurrentNode()
      }
      return checkedData
    },
    // 若节点可被选择（即 show-checkbox 为 true），则返回目前半选中的节点所组成的数组
    getHalfCheckedNodes() {
      return this.$refs.treeSelect_tree.getHalfCheckedNodes()
    },
    // 若节点可被选择（即 show-checkbox 为 true），则返回目前半选中的节点的 key 所组成的数组
    getHalfCheckedKeys() {
      return this.$refs.treeSelect_tree.getHalfCheckedKeys()
    },
    // 清空选中
    clear() {
      if (this.multiple) {
        this.$refs.treeSelect_tree.setCheckedKeys([])
        this.$nextTick(() => {
          this.handleCheckChange()
          this.handleCheckChange1()
        })
      } else {
        if (this.$refs.treeSelect_tree.getCurrentNode()) {
          this.selectValue = this.multiple ? [] : ''
          this.$emit('returnBack', this.selectValue)
          this.$refs.treeSelect_tree.setCurrentKey(null)
        }
      }
    },
    // 设置选中节点key值
    setCurrentKey(key) {
      if (Array.isArray(key) && key.length > 0) {
        this.checkCurrentNodes(key)
      } else {
        this.checkCurrentNode(key)
      }
    },
    // 全选按钮方法
    allSelectionFun() {
      // 递归
      const recursion = (data, arr) => {
        data.forEach(item => {
          const node = this.$refs.treeSelect_tree.getNode(item)
          if (node && !node.disabled) {
            arr.push(node.key)
          }
          if (item.children && item.children.length)
            recursion(item.children, arr)
        })
      }
      if (this.allSelection) {
        // 全选
        if (this.checkStrictly) {
          // 父子不关联
          const arr = []
          recursion(this.data, arr)
          this.setCurrentKey(arr)
        } else {
          // 父子相关联
          this.$refs.treeSelect_tree.setCheckedNodes(this.data)
        }
      } else {
        // 反选
        this.clear()
      }
    },
    // 自定义节点
    renderContentFun(h, { node, data, store }) {
      if (this.renderContent) {
        return this.renderContent(h, { node, data, store })
      } else if (
        this.batchReverseElection &&
        this.multiple &&
        this.checkStrictly
      ) {
        // 批量反选功能
        return (
          <span class="el-tree-node__label" title={node.label}>
            <span>{node.label}</span>
            {node.childNodes && node.childNodes.length ? (
              <button
                class="btn_mini primary plfx_btn"
                on-click={event => {
                  this.batchReverseElectionFun(event, data, node)
                }}
              >
                批量反选
              </button>
            ) : (
              ''
            )}
          </span>
        )
      } else {
        return (
          <span class="el-tree-node__label" title={node.label}>
            {node.label}
          </span>
        )
      }
    },
    // 批量反选按钮功能
    batchReverseElectionFun(event, data, node) {
      event.stopPropagation()
      const recursion = (arr, checked) => {
        if (arr && arr.length > 0) {
          arr.forEach(item => {
            this.$refs.treeSelect_tree.setChecked(item.data, checked)
            recursion(item.childNodes, checked)
          })
        }
      }
      if (node.checked) {
        this.$refs.treeSelect_tree.setChecked(data, false)
        // 取消勾选
        recursion(node.childNodes, false)
      } else {
        this.$refs.treeSelect_tree.setChecked(data, true)
        // 全部勾选
        recursion(node.childNodes, true)
      }
    },
    // ===============================================以下都是旧代码===============================================

    // 单选，选中传进来的节点
    checkSelectedNode(checkedKeys) {
      const item = checkedKeys[0]
      setTimeout(() => {
        this.$nextTick(() => {
          if (this.$refs.treeSelect_tree) {
            const node = this.$refs.treeSelect_tree.getNode(item)
            if (node && !node.disabled) {
              if (this.$refs.treeSelect_tree) {
                this.$refs.treeSelect_tree.setCurrentKey(item)
              }
              this.$nextTick(() => {
                if (this.$refs.treeSelect_tree) {
                  const node = this.$refs.treeSelect_tree.getNode(item)
                  this.setSelectOption(node)
                }
              })
            }
          }
        })
      }, 300)
    },
    // 多选，勾选上传进来的节点
    checkSelectedNodes(checkedKeys) {
      this.$refs.treeSelect_tree.setCheckedKeys(checkedKeys)
      if (this.$refs.suggest_tree)
        this.$refs.suggest_tree.setCheckedKeys(checkedKeys)
    },
    // 多选，清空所有勾选
    clearSelectedNodes() {
      const checkedKeys = this.$refs.treeSelect_tree.getCheckedKeys() // 所有被选中的节点的 key 所组成的数组数据
      for (let i = 0; i < checkedKeys.length; i++) {
        this.$refs.treeSelect_tree.setChecked(checkedKeys[i], false)
      }
    },
    initCheckedData() {
      if (this.multiple) {
        // 多选
        if (this.checkedKeys.length > 0) {
          this.checkSelectedNodes(this.checkedKeys)
        } else {
          this.clearSelectedNodes()
        }
      } else if (this.checkedKeys.length > 0) {
        this.checkSelectedNode(this.checkedKeys)
      } else {
        this.clearSelectedNode()
      }
      const suggestArr = []
      if (this.suggestKeys && this.suggestKeys.length > 0) {
        this.$nextTick(() => {
          this.suggestProps = { ...this.defaultProps }
          this.suggestProps.disabled = this.disabledFn
          this.suggestKeys.forEach(e => {
            const node = this.$refs.treeSelect_tree.getNode(e)
            if (node) {
              node.data[this.defaultProps.children] = []
              node.data[this.defaultProps.pid] = '000'
              suggestArr.push(node.data)
            }
          })
          // 如果找到了建议数据就添加一个'常用'父节点
          if (suggestArr.length !== 0) {
            const obj = {}
            obj[this.defaultProps.id] = '000'
            obj[this.defaultProps.pid] = null
            obj[this.defaultProps.label] = '常用'
            suggestArr.push(obj)
          }
          if (suggestArr && suggestArr.length > 0) {
            this.suggestTree = this.$listToTree(
              suggestArr,
              this.defaultProps.id,
              this.defaultProps.pid
            )
          }
        })
      }
      // if (this.remoteData && this.remoteData.length > 0) {
      //   this.$nextTick(() => {
      //     this.suggestTree = this.suggestTree.concat(this.remoteData)
      //   })
      // }
    },
    disabledFn(data, node) {
      return data[this.suggestProps.id] == '000'
    },
    toTree(data, id, pid) {
      // 删除 所有 children,以防止多次调用
      data.forEach(function(item) {
        delete item.children
      })
      // 将数据存储为 以 id 为 KEY 的 map 索引数据列
      const map = {}
      data.forEach(function(item) {
        map[item[id]] = item
      })
      const val = []
      data.forEach(function(item) {
        // 以当前遍历项，的pid,去map对象中找到索引的id
        const parent = map[item[pid]]
        // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
        if (parent) {
          ;(parent.children || (parent.children = [])).push(item)
        } else {
          // 如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
          val.push(item)
        }
      })
      return val
    },
    // 选中值变化时抛出change事件，返回选中id值和选中节点数据
    changeFun() {
      let checkedData
      if (this.multiple) {
        checkedData = this.$refs.treeSelect_tree.getCheckedNodes() // 所有被选中的节点所组成的数组数据
      } else {
        checkedData = this.$refs.treeSelect_tree.getCurrentNode()
      }
      this.$emit('change', this.selectValue, checkedData)
    },
    // 设置勾选节点数据的数组
    setCheckedNodes(arr) {
      this.$refs.treeSelect_tree.setCheckedNodes(arr)
    },
    // 设置勾选节点key值的数组
    setCheckedKeys(arr) {
      this.$refs.treeSelect_tree.setCheckedKeys(arr)
    },
    // 多选,删除任一select选项的回调
    removeSelectedNodes(val) {
      this.$refs.treeSelect_tree.setChecked(val, false)
      const node = this.$refs.treeSelect_tree.getNode(val)
      if (!this.checkStrictly && node.childNodes.length > 0) {
        this.treeToList(node).map(item => {
          if (item.childNodes.length <= 0) {
            this.$refs.treeSelect_tree.setChecked(item, false)
          }
        })
        this.handleCheckChange()
        this.handleCheckChange1()
      }
      let checkedData
      if (this.multiple) {
        checkedData = this.$refs.treeSelect_tree.getCheckedNodes() // 所有被选中的节点所组成的数组数据
      } else {
        checkedData = this.$refs.treeSelect_tree.getCurrentNode()
      }
      this.$emit('removeTag', this.selectValue, checkedData)
      // this.changeFun()
    },
    treeToList(tree) {
      let queen = []
      const out = []
      queen = queen.concat(tree)
      while (queen.length) {
        const first = queen.shift()
        if (first.childNodes) {
          queen = queen.concat(first.childNodes)
        }
        out.push(first)
      }
      return out
    },
    // 单选,清空select输入框的回调
    removeSelectedNode() {
      this.clearSelectedNode()
      this.changeFun()
      this.$emit('clear')
    },
    // 选中的select选项改变的回调
    changeSelectedNodes(selectValue) {
      // 多选,清空select输入框时，清除树勾选
      if (this.multiple && selectValue.length <= 0) {
        this.clearSelectedNodes()
      }
    },
    treeFilterNode(value, data) {
      if (!value) return true
      const flag =
        data[this.defaultProps.label] &&
        this.$spellSearch.match(data[this.defaultProps.label], value)
      if (!this.bFilterResult && flag) {
        this.bFilterResult = true
      }
      return flag
    },
    // 远程检索
    onSearch(val) {
      this.$emit('remoteSearch', val)
    }
  }
}
</script>
<style scoped lang="scss">
.suggestP {
  line-height: 30px;
  @include css(font-size, $fontsize_default);
  text-indent: 20px;
}
.min_width150 {
  min-width: 148px;
  box-sizing: border-box;
}
.min_width228 {
  min-width: 228px;
  box-sizing: border-box;
}
</style>

<style lang="scss">
.treeSelect_div {
  .treeSelect_mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    z-index: 11;
  }
  .treeSelect_select {
    width: 100%;
    z-index: 111;
  }
  // .el-input.is-disabled .el-input__inner {
  //   @include css(border-color, $readonly_color);
  // }
}
.treeSelect_popover {
  @include css(border, 1px solid $border_color);
  padding: 0;
  .treeSelect_tree {
    width: 100%;
    border-radius: 3px;
    padding: 0 !important;
    .el-tree-node {
      .el-tree-node__content {
        position: relative;
        .plfx_btn {
          font-size: 12px;
          position: absolute;
          top: 3px;
          right: 3px;
          display: none;
        }
        &:hover {
          > .el-tree-node__label > .plfx_btn {
            display: block;
          }
        }
      }
    }
  }
  .suggest_tree {
    padding: 0px;
    overflow: auto;
    // @include css(border-bottom, 1px solid $border_color);
  }
  .ant-input {
    border: none;
    outline: none;
    padding: 10px;
    @include css(border-bottom, 1px solid $border_color);
    &:hover,
    &:focus {
      border: none;
      @include css(border-bottom, 1px solid $border_color);
    }
  }
  .searchBtn {
    height: 25px !important;
    line-height: 25px;
    min-width: 70px !important;
    padding: 0 5px;
    @include css(background, $default_border_color!important);
    @include css(border, 1px solid $border_color!important);
    border-radius: 3px !important;
    box-shadow: none;
    text-shadow: none;
    color: #5e7bad;
    margin-right: 5px;
  }
}
.treeSelect_popover[x-placement^='bottom'] {
  margin-top: 6px;
  .popper__arrow {
    display: none;
  }
}
</style>
