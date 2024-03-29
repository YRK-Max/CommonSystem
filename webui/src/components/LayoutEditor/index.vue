<template>
  <div class="main-container">
    <div
      v-show="loading"
      class="loading-div"
    >
      <YIcon
        class="loading-icon"
        icon="yiconloading"
        color="#ffffff"
        :size="40"
      />
    </div>
    <div
      id="canvas"
      v-show="!loading"
      class="editor-content svg-main"
      @mousemove="mouseMove"
      @mouseup="mouseupCanvas"
      @mousewheel="mouseWheel"
      @mousedown="canvasMouseDown"
    >
      <el-button-group class="export-button-group">
        <el-button @click="exportData('SVG')">SVG</el-button>
        <el-button @click="exportData('JSON')">JSON</el-button>
      </el-button-group>
      <YIcon
        class="help-btn"
        style="background: #fff"
        icon="yiconwenhao"
        :size="20"
        @click="showHelp = true"
      />
      <div class="svg-container">
        <svg
          id="main_svg"
          style="width: 1920px; height: 1080px;"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          :viewBox="svgControl.x + ' ' + svgControl.y + ' ' + svgControl.width + ' ' + svgControl.height"
        >
          <SvgComponent
            v-for="(svgItem, index) in svgList"
            :key="svgItem.id"
            :objProperty="svgItem"
            @mousedown="mousedownSvg($event, svgItem.id, index)"
          />
        </svg>
      </div>
    </div>
    <div
      v-if="!loading"
      class="panel-content"
    >
      <ItemPanel class="item-panel" />
      <PropertyPanel
        class="property-panel"
        :svgInfo="selectedItem"
        @zIndexChange="sortSvgItems"
      />
    </div>
  </div>
  <el-dialog
    v-model="showHelp"
    title="Help"
  >
    <ul>
      <li>Ctrl + Alt + c: 复制</li>
      <li>Delete: 删除</li>
      <li>Ctrl + 鼠标滚动: 调节选中元素宽度</li>
      <li>鼠标滚动: 调节选中元素高度</li>
      <li>画布空白处点击，按住ctrl滚动滑轮: 缩放整个svg图</li>
    </ul>
  </el-dialog>
</template>

<script>
import YIcon from '../YIcon.vue'
import ItemPanel from './components/ItemPanel.vue'
import PropertyPanel from './components/PropertyPanel.vue'
import global from './global'
import UCore from './utils/UCore'
import SvgComponent from './components/SvgComponent.vue'

export default {
  components: { ItemPanel, PropertyPanel, YIcon, SvgComponent },
  data() {
    return {
      loading: true,
      showHelp: false,
      svgList: [],
      currentlyNewObj: {
        title: '',
        type: '',
        color: '#ffffff',
        height: 40,
        fontSize: 14,
        width: 200,
        strokeWidth: 2,
        strokeColor: '#000000',
        imageSrc: '',
        text: '',
        lockwh: true,
        angle: 0,
        zIndex: 1
      },
      moveSvg: {
        id: '',
        index: 0
      },
      selectedItem: null,
      offsetPosition: {
        positionX: 0,
        positionY: 0
      },
      svgControl: {
        x: 0,
        y: 0,
        height: 1080,
        width: 1920,
        sheight: 1080,
        swidth: 1920
      }
    }
  },
  created() {
    const _this = this
    document.onkeydown = function(event) {
      // 获取当前选中组件
      const selectSvgInfo = _this.selectedItem
      if (
        selectSvgInfo === undefined ||
        selectSvgInfo === null ||
        selectSvgInfo === ''
      ) {
        return
      }

      // 键盘按键判断:左箭头-37;上箭头-38；右箭头-39;下箭头-40
      if (event && event.key === 'ArrowLeft') {
        event.preventDefault()
        selectSvgInfo.svgPositionX -= 1
      } else if (event && event.key === 'ArrowUp') {
        event.preventDefault()
        selectSvgInfo.svgPositionY -= 1
      } else if (event && event.key === 'ArrowRight') {
        event.preventDefault()
        selectSvgInfo.svgPositionX += 1
      } else if (event && event.key === 'ArrowDown') {
        event.preventDefault()
        selectSvgInfo.svgPositionY += 1
      } else if (event && event.ctrlKey && event.altKey && event.key === 'c') {
        event.preventDefault()
        const copySvgInfoStr = JSON.stringify(selectSvgInfo)
        const copySvgInfo = JSON.parse(copySvgInfoStr)
        copySvgInfo.id = UCore.GenUUid()
        copySvgInfo.svgPositionX = selectSvgInfo.svgPositionX + 10
        copySvgInfo.svgPositionY = selectSvgInfo.svgPositionY + 10
        _this.svgList.push(copySvgInfo)
        _this.selectedItem = copySvgInfo
        setTimeout(function() {
          _this.changeSelectedItem(copySvgInfo.id)
        }, 100)
      } else if (event && event.key === 'Delete') {
        event.preventDefault()
        // 根据当前id找到当前元素的index
        const selectSvgIndex = _this.svgList.indexOf(
          _this.svgList.filter((f) => f.id === selectSvgInfo.id)[0]
        )
        _this.svgList.splice(selectSvgIndex, 1)
        if (_this.svgList.length > 0) {
          _this.selectedItem = _this.svgList[0]
          _this.changeSelectedItem(_this.selectedItem.id)
        } else {
          _this.selectedItem = null
        }
      }
    }
  },
  mounted() {
    const _this = this
    this.$nextTick(() => {
      setTimeout(() => {
        this.loading = false
        const canvasdiv = document.querySelector('#canvas')
        canvasdiv.addEventListener(
          'dragover',
          function(event) {
            event.preventDefault()
            _this.currentlyNewObj = global.CurrentlyObj
          },
          false
        )

        canvasdiv.addEventListener('drop', function(event) {
          event.preventDefault()
          if (_this.currentlyNewObj.type === '') {
            return
          }
          const svgItem = {
            id: UCore.GenUUid(),
            color: _this.currentlyNewObj.color,
            title: _this.currentlyNewObj.title,
            type: _this.currentlyNewObj.type,
            typeName: _this.currentlyNewObj.type,
            svgColor: _this.currentlyNewObj.color,
            svgPositionX: event.offsetX,
            svgPositionY: event.offsetY,
            height: _this.currentlyNewObj.height,
            width: _this.currentlyNewObj.width,
            strokeWidth: _this.currentlyNewObj.strokeWidth,
            strokeColor: _this.currentlyNewObj.strokeColor,
            fontSize: _this.currentlyNewObj.fontSize,
            svgText: _this.currentlyNewObj.text,
            angle: _this.currentlyNewObj.angle,
            zIndex: _this.currentlyNewObj.zIndex,
            lockwh: _this.currentlyNewObj.lockwh
          }
          _this.svgList.push(svgItem)
          _this.selectedItem = svgItem

          // 设置选中样式
          setTimeout(function() {
            _this.changeSelectedItem(svgItem.id)
          }, 100)

          global.CurrentlyObj = {
            title: '',
            type: '',
            color: '',
            height: 40,
            width: 200,
            fontSize: 14,
            strokeWidth: 2,
            strokeColor: '#ffffff',
            imageSrc: '',
            text: '',
            lockwh: true,
            angle: 0,
            zIndex: 1
          }
        })
      }, 300)
    })
  },
  methods: {
    mouseWheel(event) {
      // 获取当前选中组件
      const selectSvgInfo = this.selectedItem
      if (
        selectSvgInfo === undefined ||
        selectSvgInfo === null ||
        selectSvgInfo === ''
      ) {
        if (!event.ctrlKey) {
          return
        }
        event.preventDefault()
        const svgZoomHeight = event.wheelDelta > 0 ? 10.8 : -10.8
        const svgZoomWidth = event.wheelDelta > 0 ? 19.2 : -19.2
        this.svgControl.height - svgZoomHeight > 0
          ? (this.svgControl.height -= svgZoomHeight)
          : 400
        this.svgControl.width - svgZoomWidth > 0
          ? (this.svgControl.width -= svgZoomWidth)
          : 400
        const mousePositionX = event.offsetX
        const mousePositionY = event.offsetY
        const zoomOfx = this.svgControl.width / this.svgControl.swidth
        const zoomOfy = this.svgControl.height / this.svgControl.sheight
        this.svgControl.x = (1 - zoomOfx) * mousePositionX
        this.svgControl.y = (1 - zoomOfy) * mousePositionY
      } else {
        event.preventDefault()
        // 判断滚轮方向 -100是往上滑 100是下滑
        const svgItemZoom = event.wheelDelta > 0 ? '2' : '-2'
        if (event.ctrlKey) {
          selectSvgInfo.width =
            parseInt(selectSvgInfo.width) + parseInt(svgItemZoom)
          if (selectSvgInfo.width < 1) {
            selectSvgInfo.width = 1
          }
        } else {
          selectSvgInfo.height =
            parseInt(selectSvgInfo.height) + parseInt(svgItemZoom)
          if (selectSvgInfo.height < 1) {
            selectSvgInfo.height = 1
          }
        }
      }
    },
    mouseMove(event) {
      if (event.offsetX === -1) {
        return
      }
      if (event.target.nodeName === 'INPUT') {
        return
      }
      if (event.offsetY === -1) {
        return
      }
      if (this.moveSvg.id === '') {
        return
      }

      const mousePositionX = event.offsetX
      const mousePositionY = event.offsetY
      const zoomOfx = this.svgControl.width / this.svgControl.swidth
      const zoomOfy = this.svgControl.height / this.svgControl.sheight

      // 将要移动的元素坐标设备为鼠标坐标
      const svgPositionX = mousePositionX + this.offsetPosition.positionX
      const svgPositionY = mousePositionY + this.offsetPosition.positionY

      console.log('mx: ' + mousePositionX + ', my: ' + mousePositionY)
      console.log(
        'sx: ' +
          this.svgList[this.moveSvg.index].svgPositionX +
          ', sy: ' +
          this.svgList[this.moveSvg.index].svgPositionY
      )
      console.log(
        'ox: ' +
          this.offsetPosition.positionX +
          ', oy: ' +
          this.offsetPosition.positionY
      )
      console.log('zx: ' + zoomOfx + ', zy: ' + zoomOfy)
      console.log('rx: ' + svgPositionX + ', ry: ' + svgPositionY)
      console.log(
        '--------------------------------------------------------------------------------'
      )

      this.svgList[this.moveSvg.index].svgPositionX = svgPositionX
      this.svgList[this.moveSvg.index].svgPositionY = svgPositionY
    },
    mouseupCanvas() {
      // 移动结束后将移动标志去掉
      this.moveSvg = {
        id: '',
        index: 0
      }
    },
    mousedownSvg(event, id, index) {
      event.stopPropagation()
      // 从数组里面根据index找到当前元素
      this.moveSvg.id = id
      this.moveSvg.index = index
      // 变更选中元素
      this.selectedItem = this.svgList[index]
      // 获取初始偏移量
      this.offsetPosition.positionX =
        this.selectedItem['svgPositionX'] - event.offsetX
      this.offsetPosition.positionY =
        this.selectedItem['svgPositionY'] - event.offsetY
      // 添加选中
      this.changeSelectedItem(id)
    },
    canvasMouseDown(event) {
      event.preventDefault()
      // 获取所有g标签 清除所有选中样式
      const gAnyList = document.querySelectorAll('g')
      gAnyList.forEach((g) => {
        g.classList.remove('topo-layer-view-selected')
      })
      this.selectedItem = null
    },
    changeSelectedItem(id) {
      // 获取所有g标签，并移除所有g标签上的选中状态
      const gAnyList = document.querySelectorAll('g')
      gAnyList.forEach((g) => {
        g.classList.remove('topo-layer-view-selected')
      })
      // 根据id给元素加上选中状态
      const dom = document.getElementById(id)
      dom.classList.add('topo-layer-view-selected')
    },
    sortSvgItems() {
      const tempSvgList = JSON.parse(JSON.stringify(this.svgList))
      this.svgList = []
      tempSvgList.sort((a, b) => {
        return a['zIndex'] - b['zIndex']
      })
      this.svgList = tempSvgList
    },
    exportData(data) {
      if (data === 'SVG') {
        const svg_ele = document.getElementById('main_svg')
        alert(svg_ele.outerHTML)
      } else if (data === 'JSON') {
        alert(JSON.stringify(this.svgList))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.loading-div {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .loading-icon {
    animation: loadingRotate 2s infinite linear;
  }
}

.main-container {
  height: 100%;
  width: 100%;
  padding: 5px;
  background: #444f5a;
  display: flex;
  .editor-content {
    width: calc(75% - 8px);
    height: 100%;
    margin-right: 8px;
    position: relative;

    .export-button-group {
      position: absolute;
      top: 8px;
      left: 8px;
    }

    .help-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      border-radius: 50%;
    }
  }
  .panel-content {
    width: 25%;
    height: 100%;
    .item-panel {
      height: calc(50% - 5px);
      background: #fff;
      margin-bottom: 10px;
      border-radius: 4px;
      padding: 4px;
    }
    .property-panel {
      height: calc(50% - 5px);
      background: #fff;
      border-radius: 4px;
      padding: 4px;
    }
  }
}

.svg-main {
  border-radius: 4px;
  border: 1px solid #d1d1d1;
  background: #fcfcfc;
  background-image: linear-gradient(rgba(204, 204, 204, 0.3) 1px, transparent 0),
    linear-gradient(90deg, rgba(206, 206, 206, 0.43) 1px, transparent 0),
    linear-gradient(#9d9d9d 1px, transparent 0),
    linear-gradient(90deg, #c3c3c3 1px, transparent 0);
  background-size: 15px 15px, 15px 15px, 75px 75px, 75px 75px;
}

.topo-layer-view-selected {
  outline: 2px dashed rgb(0, 140, 255);
  outline-offset: 5px;
}

.svg-container {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.svg-container::-webkit-scrollbar {
  width: 9px;
  height: 9px;
}
.svg-container::-webkit-scrollbar-track {
  background: transparent;
}
.svg-container::-webkit-scrollbar-thumb {
  background-color: rgba(155, 155, 155, 0.5);
  border-radius: 20px;
  border: transparent;

  &:hover {
    background-color: #929292;
  }
}

@keyframes loadingRotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
