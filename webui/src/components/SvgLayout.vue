<template>
  <div id="svg_layout" class="layout" />
</template>

<script>
import * as d3 from 'd3'
import { getLayout, executeSQL } from '@/api/server'
import { ElNotification } from 'element-plus'

export default {
  name: 'SvgLayout',
  props: ['layoutName'],
  watch: {
    layoutName: {
      // eslint-disable-next-line no-unused-vars
      handler(n, o) {
        this.refreshLayout()
      }
    }
  },
  mounted() {
    this.refreshLayout()
  },
  methods: {
    refreshLayout() {
      getLayout({ layout_name: this.layoutName }).then(res => {
        if (res && res['code'] === 200) {
          this.initLayout(res['msg'])
          executeSQL({ sql_name: 'getRtmMachineState' }).then(r => {
            if (r && r['code'] === 200) {
              const result = r['data']
              result.forEach(ma => {
                d3.selectAll('.' + ma['machine_name']).selectAll('rect').attr('fill', this.getColorByState(ma['machine_state_name']))
                d3.selectAll('.' + ma['machine_name'] + '-recipe').selectAll('text').text(ma['RECIPE_NAME'] || 'NO RECIPE')

                d3.selectAll('.' + ma['machine_name']).selectAll('rect').on('click', (e) => {
                  this.visible = true
                  this.$emit('UnitClick', e['target']['classList'][0])
                })
              })
            } else {
              ElNotification.error({
                message: '获取设备状态失败',
                description: r['message']
              })
            }
          })
        } else {
          this.$notification['error']({
            message: '获取数据失败',
            description: res['message']
          })
        }
      })
    },
    getColorByState(state) {
      switch (state) {
        case 'Idle': return '#FFD700'
        case 'Trouble': return '#ff5e5e'
        case 'Run': return '#94ec8a'
        case 'PM': return '#4889fc'
        case 'Stop': return '#9e3da5'
        default: return '#d0d0d0'
      }
    },
    initLayout(svg_str = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg"></svg>') {
      const xml_obj = this.xmlStr2XmlObj(svg_str)
      if (xml_obj.children.length > 0) {
        xml_obj.children[0].id = 'machine_layout'
        document.getElementById('svg_layout').innerHTML = ''
        document.getElementById('svg_layout').appendChild(xml_obj.children[0])
      }
      const ele_ml = document.getElementById('machine_layout')
      if (ele_ml) {
        ele_ml.setAttribute('width', '100%')
        ele_ml.setAttribute('height', '100%')
      }
    },
    xmlStr2XmlObj(xmlStr) {
      let xmlObj = {}
      if (document.all) {
        // eslint-disable-next-line no-undef
        const xmlDom = new ActiveXObject('Microsoft.XMLDOM')
        xmlDom.loadXML(xmlStr)
        xmlObj = xmlDom
      } else {
        xmlObj = new DOMParser().parseFromString(xmlStr, 'text/xml')
      }
      return xmlObj
    }
  }
}
</script>

<style scoped>
.layout {
  border-radius: 4px;
  overflow: hidden;
}
</style>
