/* eslint-disable */
import elementResizeDetectorMaker from 'element-resize-detector'

/**
 * 描述：将对象数组中的字段重构为数组
 * 参数：input--输入数组，field--需要提取的字段名，isRate--是否为比率，默认为false
 **/
export function getObjArrayFieldToArray(input, field, isRate = false) {
  const output = []
  for (let i = 0; i < input.length; ++i) { output.push(isRate ? (input[i][field] * 100).toFixed(2) : input[i][field]) }
  return output
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 */
export function handleTree(data, id, parentId, children) {
  const config = {
    id: id || 'id',
    parentId: parentId || 'parentId',
    childrenList: children || 'children'
  }

  var childrenListMap = {}
  var nodeIds = {}
  var tree = []

  for (const d of data) {
    const parentId = d[config.parentId]
    if (childrenListMap[parentId] == null) {
      childrenListMap[parentId] = []
    }
    nodeIds[d[config.id]] = d
    childrenListMap[parentId].push(d)
  }

  for (const d of data) {
    const parentId = d[config.parentId]
    if (nodeIds[parentId] == null) {
      tree.push(d)
    }
  }

  for (const t of tree) {
    adaptToChildrenList(t)
  }

  function adaptToChildrenList(o) {
    if (childrenListMap[o[config.id]] !== null) {
      o[config.childrenList] = childrenListMap[o[config.id]]
    }
    if (o[config.childrenList]) {
      for (const c of o[config.childrenList]) {
        adaptToChildrenList(c)
      }
    }
  }
  return tree
}

/**
 * 生成随机10位数字ID
 */
export function getUUIDNum() {
  let numStr = Math.ceil(Math.random() * 10).toString()

  for (let index = 0; index < 9; index++) {
    numStr = numStr + Math.floor(Math.random() * 10).toString()
  }

  return numStr
}

// Echart  监听div容器和窗口变化，自适应图表

/*
*  that: 当前调用方法的this对象
*  myChart：echart图对象
*  domId：容器id
*/
export function chartResizeListen(that, myChart, domId) {
  // 监听window窗口变化
  window.addEventListener('resize', () => {
    myChart.resize()
  })

  // 监听div大小变化
  const erd = elementResizeDetectorMaker()
  erd.listenTo(document.getElementById(domId), () => {
    that.$nextTick(() => {
      myChart.resize()
    })
  })
}
