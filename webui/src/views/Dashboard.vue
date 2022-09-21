<template>
  <div
    class="p-2"
    style="background: #ebeef3"
  >
    <el-row :gutter="8" class="enter-y">
      <el-col :lg="6" :sm="24" class="pb-2">
        <InfoCard
          icon="yiconshebei"
          color="#426cb9"
          bgColor="#d1e1ff"
          title="在制产品信息"
          label1="滞留数"
          label2="在制总数"
          :num1="cardInfos.card1.num1"
          :num2="cardInfos.card1.num2"
        ></InfoCard>
      </el-col>
      <el-col :lg="6" :sm="24" class="pb-2">
        <InfoCard
          icon="yicondowntime"
          color="#426cb9"
          bgColor="#d1e1ff"
          title="出货数量"
          label1="今日出货数"
          label2="月出货总数"
          :num1="cardInfos.card2.num1"
          :num2="cardInfos.card2.num2"
        ></InfoCard>
      </el-col>
      <el-col :lg="6" :sm="24" class="pb-2">
        <InfoCard
          icon="yiconjihua"
          color="#426cb9"
          bgColor="#d1e1ff"
          title="良率"
          label1="今日良率"
          label2="月良率"
          :num1="cardInfos.card2.num1 + '%'"
          :num2="cardInfos.card2.num2 + '%'"
        ></InfoCard>
      </el-col>
      <el-col :lg="6" :sm="24" class="pb-2">
        <InfoCard
          icon="yiconB1"
          color="#426cb9"
          bgColor="#d1e1ff"
          title="设备报警数量"
          label1="今日报警数"
          label2="月报警总数"
          :num1="cardInfos.card4.num1"
          :num2="cardInfos.card4.num2"
        ></InfoCard>
      </el-col>
    </el-row>
    <el-row class="enter-y" :gutter="6">
      <el-col :lg="8" :sm="24">
        <el-card header="分时产能" class="mb-2" :body-style="{padding: '10px', height: '350px' }">
          <BarChart :xAxis="chartData.chart1.xAixs" :series="chartData.chart1.series" />
        </el-card>
      </el-col>
      <el-col :lg="8" :sm="24">
        <el-card header="异常检测列表" class="mb-2" :body-style="{padding: '10px', height: '350px' }">
          <DataTable
            :columns="columns"
            :datasource="datasource"
            :showPager="false"
          />
        </el-card>
      </el-col>
      <el-col :lg="8" :sm="24">
        <el-card header="月[出货/不良品]趋势" class="mb-2" :body-style="{padding: '10px', height: '350px' }">
          <LineChart :xAxis="chartData.chart2.xAixs" :series="chartData.chart2.series" />
        </el-card>
      </el-col>
    </el-row>
    <div
      class="enter-y mb-3"
      style="height: 460px; "
    >
      <el-row
        class="h-full enter-y"
        :gutter="6"
      >
        <el-col
          :span="12"
          class="h-full"
        >
          <ProgressCardList/>
        </el-col>
        <el-col class="h-full" :span="12">
          <el-card class="h-full">
            <div style="height: 30px; margin: 5px; width: 100%; display: flex; ">
              <div style="display: flex; justify-content: center; align-items: center; margin-left: 10px;">
                <div style="background: #94ec8a; border-radius: 5px; height: 15px; width: 20px; margin-right: 5px" />
                <label style="font-weight: bold">RUN</label>
              </div>
              <div style="display: flex; justify-content: center; align-items: center; margin-left: 10px;">
                <div style="background: #FFD700; border-radius: 5px; height: 15px; width: 20px; margin-right: 5px" />
                <label style="font-weight: bold">IDLE</label>
              </div>
              <div style="display: flex; justify-content: center; align-items: center; margin-left: 10px;">
                <div style="background: #4889fc; border-radius: 5px; height: 15px; width: 20px; margin-right: 5px" />
                <label style="font-weight: bold">PM</label>
              </div>
              <div style="display: flex; justify-content: center; align-items: center; margin-left: 10px;">
                <div style="background: #9e3da5; border-radius: 5px; height: 15px; width: 20px; margin-right: 5px" />
                <label style="font-weight: bold">STOP</label>
              </div>
              <div style="display: flex; justify-content: center; align-items: center; margin-left: 10px;">
                <div style="background: #ff5e5e; border-radius: 5px; height: 15px; width: 20px; margin-right: 5px" />
                <label style="font-weight: bold">TROUBLE</label>
              </div>
            </div>
            <SvgLayout layoutName="LAYOUT_1" />
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import LineChart from '@/components/charts/LineChart.vue'
import ProgressCardList from '@/components/ProgressCardList'
import store from '@/store'
import { defineComponent, reactive } from '@vue/runtime-core'
import DataTable from '../components/DataTable.vue'
import InfoCard from '../components/InfoCard.vue'
import BarChart from '@/components/charts/BarChart.vue'
import { executeSQL } from '@/api/server'
import SvgLayout from '@/components/SvgLayout.vue'
import { ElNotification } from 'element-plus'

export default defineComponent({
  components: {
    LineChart,
    ProgressCardList,
    DataTable,
    InfoCard,
    BarChart,
    SvgLayout
  },
  computed: {
    isMobile() { return store.state.app.device === 'mobile' }
  },
  setup() {
    const chartOfClones = reactive({
      legend: [],
      xAixs: [],
      series: []
    })
    const chartOfViews = reactive({
      legend: [],
      xAixs: [],
      series: []
    })
    const responese = reactive({
      clone_flag: false,
      view_flag: false
    })
    const datasource = []
    const columns = [
      { type: 'alarm 代码', width: 40 },
      { field: 'alarm 描述', title: 'Name', sortable: true, filterMultiple: true },
      { field: '严重级别', title: 'Nickname' },
      { field: '发生时间', title: 'Role', showOverflow: true, showHeaderOverflow: true },
      { field: '状态', title: 'Address', showOverflow: true }
    ]

    const cardInfos = reactive({
      card1: {
        num1: 0,
        num2: 0
      },
      card2: {
        num1: 0,
        num2: 0
      },
      card4: {
        num1: 0,
        num2: 0
      }
    })

    const labelOption = {
      show: true,
      rotate: 90,
      align: 'left',
      verticalAlign: 'middle',
      position: 'insideBottom',
      distance: 15,
      formatter: '{c}',
      fontSize: 11,
      rich: {
        name: {}
      }
    }

    const chartData = reactive({
      chart1: {
        xAixs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
        series: [
          {
            name: '分时产能',
            data: [150, 230, 224, 218, 135, 147, 260, 450, 365, 440, 510, 12, 350, 450, 432, 478, 512, 487, 24],
            type: 'bar',
            barMaxWidth: 20,
            label: labelOption,
            itemStyle: {
              normal: {
                barBorderRadius: [8, 8, 0, 0]
              }
            }
          }
        ]
      },
      chart2: {
        xAixs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
        series: [
          {
            name: '出货数量',
            data: [150, 230, 224, 218, 135, 147, 260, 450, 365, 440, 510, 420, 350, 450, 432, 478, 512, 487, 389],
            type: 'line'
          },
          {
            name: '不良品数量',
            data: [12, 18, 25, 35, 47, 46, 42, 36, 53, 61, 58, 53, 51, 49, 45, 41, 35, 36, 56],
            type: 'line'
          }
        ]
      }
    })

    executeSQL({ sql_name: 'getWIPAsisCount' }).then(res => {
      if (res && res['code'] === 200) {
        const result = res['data'][0]
        cardInfos.card1.num1 = result['delay_count']
        cardInfos.card1.num2 = result['total_count']
      }
    })

    executeSQL({ sql_name: 'getRtmAlarmCount' }).then(r => {
      if (r && r['code'] === 200) {
        cardInfos.card4.num1 = r['data'][0]['TODAYCOUNT']
        cardInfos.card4.num1 = r['data'][0]['MONTHCOUNT']
        // that.alarm_info.s_count = r['result'][0]['SCOUNT']
        // that.alarm_info.w_count = r['result'][0]['WCOUNT']
        // that.alarm_info.l_count = r['result'][0]['LCOUNT']
      } else {
        ElNotification.error({
          message: '获取设备状态失败',
          description: r['msg']
        })
      }
    })

    executeSQL({ sql_name: 'getDayMonthShipCount' }).then((res) => {
      if (res && res['code'] === 200) {
        const ship_infos = res['data'][0]
        cardInfos.card2.num1 = parseInt(ship_infos['month_ship_count'])
        cardInfos.card2.num2 = parseInt(ship_infos['today_ship_count'])
      } else {
        ElNotification.error({
          message: '获取数据失败',
          description: res['msg']
        })
      }
    })

    return {
      chartOfClones,
      chartOfViews,
      responese,
      datasource,
      columns,
      cardInfos,
      chartData
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.chart-container {
  height: 450px;

  .chart-container-header {
    height: 38px;
    border-bottom: 1px dashed #dedede;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-inline: 8px;
    h1 {
      font-weight: bold;
    }
  }

  .chart-container-content {
    height: calc(100% - 38px);
    padding: 5px;
  }
}

.success-msg {
  border-color: #2eca03;
  background: #d5ffc9;
  color: #2eca03;
}

.message-class {
  animation: message 2s forwards;
  font-size: small;
  border-radius: 5px;
  border: 1px solid #dedede;
  text-align: center;
  height: 24px;
  line-height: 24px;
  padding-inline: 6px;
}

@keyframes message {
  0% {
    transform: translateY(90%);
    opacity: 0;
  }
  35% {
    transform: translateY(0);
    opacity: 1;
  }
  65% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-90%);
    opacity: 0;
  }
}
</style>
