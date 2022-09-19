<template>
  <div class="main-container card-class h-full">
    <div class="main-header">
      <div class="main-header-item flex justify-between items-center pl-2 pr-2">
        <h1 class="font-bold text-xl">工单进度</h1>
        <h1 class="font-bold text-xl">9月</h1>
      </div>
      <div class="main-header-item flex justify-between items-center pl-2 pr-2">
        <div class="flex justify-center items-center">
          <div>
            <h1 class="block text-2xl font-bold">3</h1>
            <h1 class="block text-sm">进行中</h1>
          </div>
          <div class="ml-6">
            <h1 class="block text-2xl font-bold">11</h1>
            <h1 class="block text-sm">未开始</h1>
          </div>
          <div class="ml-6">
            <h1 class="block text-2xl font-bold">16</h1>
            <h1 class="block text-sm">Total WorkOrder</h1>
          </div>
        </div>
        <div class="flex">
          <YIcon
            class="mr-2"
            :class="{ 'display-selected':  displayType=='list'}"
            :color="displayType === 'list' ? '#ffffff' : '#010101'"
            icon="yiconlist"
            @click="displayType='list'"
          />
          <YIcon
            :class="{ 'display-selected':  displayType=='card'}"
            :color="displayType === 'card' ? '#ffffff' : '#010101'"
            icon="yiconmore"
            @click="displayType='card'"
          />
        </div>
      </div>
    </div>
    <div class="main-content">
      <el-row class="main-row" :gutter="6">
        <el-col
          v-for="(item, index) of cardInfoList"
          class="mb-1.5"
          :key="index"
          :xl="displayType === 'list' ? 24 : 12"
          :lg="displayType === 'list' ? 24 : 12"
          :sm="24"
        >
          <ProgressCard
            style="height: 200px"
            :title="item['title']"
            :description="item['description']"
            :color="item['color']"
            :bgColor="item['bgcolor']"
            :lastUpdateTime="item['lastUpdateTime']"
            :remainDays="item['remainDays']"
            :progress="item['progress']"
          />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import ProgressCard from './components/ProgressCard.vue'
import YIcon from '@/components/YIcon.vue'

export default defineComponent({
  components: {
    ProgressCard,
    YIcon
  },
  setup() {
    const cardInfoList = [
      { title: 'CJNonCu-Prod', progress: 20, description: 'P3-01000042 -- 长存生产工单', lastUpdateTime: '2022-09-12', bgcolor: '#fee4cb', color: '#ff942e', remainDays: 2 },
      { title: 'CJNonCu-Product', progress: 5, description: 'P3-01000039', lastUpdateTime: '2022-09-12', bgcolor: '#e9e7fd', color: '#4f3ff0', remainDays: 10 },
      { title: 'HHQK-JZSY-Test', progress: 58, description: 'P3-01000078', lastUpdateTime: '2022-09-12', bgcolor: '#dbf6fd', color: '#096c86', remainDays: 8 }
    ]
    // eslint-disable-next-line prefer-const
    let displayType = ref('card')
    return {
      cardInfoList,
      displayType
    }
  }
})
</script>

<style lang="scss" scoped>
.main-container {
  background: #fff;
  padding: 5px 5px 0 5px;

  .main-header {
    height: 98px;
    & .main-header-item:nth-child(1) {
      height: 38px;
    }
    & .main-header-item:nth-child(2) {
      height: 60px;
    }
  }

  .main-content {
    height: 350px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .main-content::-webkit-scrollbar {
    width: 9px;
    height: 9px;
  }
  .main-content::-webkit-scrollbar-track {
    background: transparent;
  }
  .main-content::-webkit-scrollbar-thumb {
    background-color: rgba(155, 155, 155, 0.5);
    border-radius: 20px;
    border: transparent;

    &:hover {
      background-color: #929292;
    }
  }
}

.display-selected {
  background: var(--main-color);
  width: 25px;
  height: 25px;
  border-radius: 5px;
}
</style>
