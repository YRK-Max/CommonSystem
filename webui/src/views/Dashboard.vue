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
        <InfoCard icon="yicondowntime" color="#ff942e" bgColor="#ffead6" title="故障检测模型"></InfoCard>
      </el-col>
      <el-col :lg="6" :sm="24" class="pb-2">
        <InfoCard icon="yiconjihua" color="#4f3ff0" bgColor="#d1ccff" title="故障检测数量"></InfoCard>
      </el-col>
      <el-col :lg="6" :sm="24" class="pb-2">
        <InfoCard icon="yiconB1" color="#c12c1f" bgColor="#ffd0cc" title="设备报警数量"></InfoCard>
      </el-col>
    </el-row>
    <el-row class="enter-y" :gutter="6">
      <el-col :lg="8" :sm="24">
        <el-card header="实时异常检测" class="mb-2" :body-style="{padding: '10px', height: '350px' }">
          <BarChart />
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
        <el-card header="每月异常检测总数" class="mb-2" :body-style="{padding: '10px', height: '350px' }">
          <LineChart />
        </el-card>
      </el-col>
    </el-row>
    <div
      class="enter-y mb-3"
      style="display: flex; height: 460px; "
    >
      <el-row
        class="h-full enter-y little-component-class"
        :gutter="6"
      >
        <el-col
          :span="24"
          class="h-full"
        >
          <ProgressCardList/>
        </el-col>
      </el-row>
      <div v-if="!isMobile" class="w-240 h-full ml-2">
        <MonacoEditor />
      </div>
    </div>
  </div>
</template>

<script>
import LineChart from '@/components/charts/LineChart.vue'
import ProgressCardList from '@/components/ProgressCardList'
import store from '@/store'
import { defineComponent, reactive } from '@vue/runtime-core'
import MonacoEditor from '@/components/MonacoEditor/index.vue'
import DataTable from '../components/DataTable.vue'
import InfoCard from '../components/InfoCard.vue'
import BarChart from '@/components/charts/BarChart.vue'
import { executeSQL } from '@/api/server'

export default defineComponent({
  components: {
    LineChart,
    ProgressCardList,
    MonacoEditor,
    DataTable,
    InfoCard,
    BarChart
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
    const datasource = [
      { id: 10001, name: 'Test1', nickname: 'T1', role: 'Develop', sex: '1', age: 28, address: 'Shenzhen' },
      { id: 10002, name: 'Test2', nickname: 'T2', role: 'Test', sex: '0', age: 22, address: 'Guangzhou' },
      { id: 10003, name: 'Test3', nickname: 'T3', role: 'PM', sex: '1', age: 32, address: 'Shanghai' },
      { id: 10004, name: 'Test4', nickname: 'T4', role: 'Designer', sex: '0', age: 23, address: 'Shenzhen' },
      { id: 10005, name: 'Test5', nickname: 'T5', role: 'Develop', sex: '0', age: 30, address: 'Shanghai' },
      { id: 10006, name: 'Test6', nickname: 'T6', role: 'Develop', sex: '0', age: 27, address: 'Shanghai' },
      { id: 10007, name: 'Test7', nickname: 'T7', role: 'Develop', sex: '1', age: 29, address: 'Shenzhen' },
      { id: 10008, name: 'Test8', nickname: 'T8', role: 'Develop', sex: '0', age: 32, address: 'Shanghai' },
      { id: 10009, name: 'Test9', nickname: 'T9', role: 'Develop', sex: '1', age: 30, address: 'Shenzhen' },
      { id: 10010, name: 'Test10', nickname: 'T10', role: 'Develop', sex: '0', age: 34, address: 'Shanghai' }
    ]
    const columns = [
      { type: 'seq', width: 40 },
      { field: 'name', title: 'Name', sortable: true, filterMultiple: true },
      { field: 'nickname', title: 'Nickname' },
      { field: 'role', title: 'Role', showOverflow: true, showHeaderOverflow: true },
      { field: 'address', title: 'Address', showOverflow: true }
    ]

    const cardInfos = reactive({
      card1: {
        num1: 0,
        num2: 0
      }
    })

    executeSQL({ sql_name: 'getWIPAsisCount' }).then(res => {
      if (res && res['code'] === 200) {
        const result = res['data'][0]
        cardInfos.card1.num1 = result['delay_count']
        cardInfos.card1.num2 = result['total_count']
      }
    })

    return {
      chartOfClones,
      chartOfViews,
      responese,
      datasource,
      columns,
      cardInfos
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
