import Vue from 'vue'
// 递归树形数据（data: 数据源，id：键值，pid：父键值，pvalue：一级节点pid的值）
const getTreeData = function (data, id, pid, pvalue) {
  const _data = {}
  data.map(item => {
    if (!_data[item[pid]]) _data[item[pid]] = []
    _data[item[pid]].push(item)
  })
  const root = _data[pvalue]

  function inner (temp = []) {
    return temp.map(item => {
      item.children = _data[item[id]] || []
      if (_data[item[id]]) inner(_data[item[id]])
      return item
    })
  }

  return inner(root)
}
Vue.prototype.$getTreeData = getTreeData

// list递归tree（data: 数据源，id：键值，pid：父键值）     适用于不规范数据
const listToTree = function (data, id, pid) {
  function exists (data, parentId) {
    for (let i = 0; i < data.length; i++) {
      if (data[i][id] == parentId) return true
    }
    return false
  }

  const nodes = []
  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    if (!exists(data, row[pid])) nodes.push(row)
  }
  const toDo = []
  for (let i = 0; i < nodes.length; i++) {
    toDo.push(nodes[i])
  }
  while (toDo.length) {
    const node = toDo.shift()
    for (let i = 0; i < data.length; i++) {
      const row = data[i]
      if (row[pid] == node[id]) {
        if (node.children) node.children.push(row)
        else node.children = [row]
        toDo.push(row)
      }
    }
  }
  return nodes
}
Vue.prototype.$listToTree = listToTree

// table组件固定表头计算高度方法（id：父容器标签的id）
const tableAuto = function (id) {
  if (document.getElementById(id))
    return document.getElementById(id).clientHeight - 40
}
Vue.prototype.$tableAuto = tableAuto

// 随机数
const randomNum = function () {
  return (
    (Math.random() * 10000000).toString(16).substr(0, 4) +
    new Date().getTime() +
    Math.random()
      .toString()
      .substr(2, 5)
  )
}
Vue.prototype.$randomNum = randomNum

// UUID
const UUID = function () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
Vue.prototype.$UUID = UUID

// 用作非父子组件通信
const eventHub = new Vue()
Vue.prototype.$eventHub = eventHub

//
// 找到树第一个点击节点
function findFirstChildren (data) {
  if (data.children && data.children.length > 0) {
    return findFirstChildren(data.children[0])
  } else {
    return data
  }
}

Vue.prototype.$findFirstChildren = findFirstChildren

// 深拷贝
function deepClone (obj, hash = new WeakMap()) {
  // null 或者 undefined null == undefined log-->true
  if (obj == null) return obj;
  // number string boolean symbol
  // 基本类型类型不为object
  // function 一般不需要拷贝
  if (typeof obj !== 'object') return obj;
  // object
  // 日期
  if (obj instanceof Date) return new Date(obj);
  // 正则
  if (obj instanceof RegExp) return new RegExp(obj);
  // 数组 / {}
  // 使用WeakMap判断值是否已被记录，防止无限引用爆掉内存
  if (hash.get(obj)) {
    return hash.get(obj)
  }
  // 调用引用类型构造函数创建
  let newObj = new obj.constructor;
  hash.set(obj, newObj);
  // 迭代读取值
  for (let key in obj) {
    // 私有属性进行克隆
    if (obj.hasOwnProperty(key)) {
      // 递归深拷贝对象属性值
      newObj[key] = deepClone(obj[key], hash);
    }
  }
  return newObj;
}

Vue.prototype.$deepClone = deepClone

// 调整顺序
function exchange (start, end, arr, onlyKey) {
  let temp = arr[start].xh
  arr[start].xh = arr[end].xh
  arr[end].xh = temp
  const outArr = []
  temp = {
    xh: arr[start].xh
  }
  temp[onlyKey] = arr[start][onlyKey]
  outArr.push(temp)
  temp = {
    xh: arr[end].xh
  }
  temp[onlyKey] = arr[end][onlyKey]
  outArr.push(temp)
  return outArr
}

Vue.prototype.$exchange = exchange

//阿拉伯数字转中文数字
function getChineseNum (section) {
  const chnNumChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const chnUnitChar = ['', '十', '百', '千', '万', '亿', '万亿', '亿亿'];
  let strIns = '', chnStr = '';
  let unitPos = 0;
  let zero = true;
  let oldSection = section;
  while (section > 0) {
    const v = section % 10;
    if (v === 0) {
      if (!zero) {
        zero = true;
        chnStr = chnNumChar[v] + chnStr;
      }
    } else {
      zero = false;
      strIns = (oldSection + '').length === 2 && v === 1 && unitPos === 1 ? '' : chnNumChar[v];
      strIns += chnUnitChar[unitPos];
      chnStr = strIns + chnStr;
    }
    unitPos++;
    section = Math.floor(section / 10);
  }
  return chnStr;
}

Vue.prototype.$NoToChinese = getChineseNum

//检测子数据是否有效
function isChildren (item) {
  return item.children && item.children.length > 0
}

Vue.prototype.$isChildren = isChildren


// 防止多次点击造成页面多次跳转
function throttle (fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 300;
  }
  let _lastTime = null;
  // 返回新的函数
  return function () {
    let _nowTime = +new Date ();
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply (this, arguments); //将this和参数传给原函数
      _lastTime = _nowTime;
    }
  };
}
Vue.prototype.$throttle = throttle

// 获取任意时间的最后一天
function getLastDay (d) {
  var current = new Date(d)
  var currentMonth = current.getMonth()
  var nextMonth = ++currentMonth
  var nextMonthDayOne = new Date(current.getFullYear(), nextMonth, 1)
  var minusDate = 1000 * 60 * 60 * 24
  return new Date(nextMonthDayOne.getTime() - minusDate)
}
Vue.prototype.$getLastDay = getLastDay

// 格式化数字: 以千为单位分割
function formatNum (num) {
  return (num + '').replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1 ')
}
Vue.prototype.$formatNum = formatNum