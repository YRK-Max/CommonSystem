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

/**
 * 获取当前时间 格式：yyyy-MM-dd HH:MM:SS
 */
 export function getCurrentTime(type, diff=0, unit) {
  let curTime = ''
  let diffTime = 0

  switch(unit){
    case 'month': diffTime = diff * 30 * 24 * 60 * 60 * 1000; break;
    case 'day': diffTime = diff * 24 * 60 * 60 * 1000; break;
    case 'hour': diffTime = diff * 60 * 60 * 1000; break;
    case 'min': diffTime = diff * 60 * 1000; break;
    case 'sec': diffTime = diff * 1000; break;
    default: break;
  }

  let date = new Date();//当前时间
  let getTimes = date.getTime()
  date.setTime(getTimes + diffTime)
  let month = zeroFill(date.getMonth() + 1);//月
  let day = zeroFill(date.getDate());//日
  let hour = zeroFill(date.getHours());//时
  let minute = zeroFill(date.getMinutes());//分
  let second = zeroFill(date.getSeconds());//秒

  //当前时间
  switch (type){
    case 'date': curTime = date.getFullYear() + "-" + month + "-" + day; break;
    default: curTime = date.getFullYear() + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
  }


  return curTime;
}

/**
 * 补零
 */
function zeroFill(i){
  if (i >= 0 && i <= 9) {
    return "0" + i;
  } else {
    return i;
  }
}

/**
 * 时间格式化
 * @param value
 * @param fmt
 * @returns {*}
 */
export function formatDate(value, fmt) {
  let regPos = /^\d+(\.\d+)?$/;
  if (regPos.test(value)) {
    //如果是数字
    let getDate = new Date(value);
    let o = {
      'M+': getDate.getMonth() + 1,
      'd+': getDate.getDate(),
      'h+': getDate.getHours(),
      'm+': getDate.getMinutes(),
      's+': getDate.getSeconds(),
      'q+': Math.floor((getDate.getMonth() + 3) / 3),
      'S': getDate.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (getDate.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return fmt;
  } else {
    //TODO
    value = value.trim();
    return value.substr(0, fmt.length);
  }
}
