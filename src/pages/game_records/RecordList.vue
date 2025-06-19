<template>
  <div>
    <div class="grid grid-cols-[36px_64px_1fr] items-center text-xs border-b-[5px] border-gray-200/80 py-1.5 px-1 sticky top-[44px] bg-white">
      <div>时间</div>
      <div>期数</div>
      <Tabs v-model="currentTab" :tabs="tabs" :shouldToggle="false" tabClass="tab-item" activeClass="tab-active" class="flex text-sm overflow-auto" />
    </div>
    <div v-if="loadRef && computedDatas.length === 0" class="loading-container">
      <div class="spinner"></div>
    </div>
    <ScrollObserver @onBottom="readmore" :hasMore="hasMore">
      <div v-for="(record, index) in computedDatas"
        :key="record.GameID + index"
        class="flex items-center bg-gray-100 even:bg-white space-x-2 py-2 px-1"
      >
        <div class="text-xs">{{ formatDate(record.OpenTime, "HH:mm") }}</div>
        <div class="text-xs">{{ record.GameID }}期</div>
        <div v-if="computedDatas" class="flex-1">
          <LotteryBalls v-if="currentTab === 'recordNumber'" :balls="record.balls" ballClass="flex-1 text-xs" textClass="text-gray-400 text-xs" />
          <div class="text-xs text-gray-700 flex justify-between py-1.5 flex-wrap" v-else-if="currentTab === 'recordTM'">
            <span v-for="lm in record.LiangMian.split(',')" :key="lm" v-text="lm" class="px-0.5 py-1" />
          </div>
        </div>
      </div>
    </ScrollObserver>
    
  </div>
</template>

<script setup lang="ts">
import { useApi } from "@/libs/Api";
import { onMounted, ref } from "vue";
import { formatDate } from "@/libs/Common";
import { usePagination, applyRecordData, useLotteryData } from "@/components/LotteryPanel/common";
import Tabs from '@/components/Tabs.vue'
import LotteryBalls from '@components/LotteryPanel/LotteryBalls.vue';
import ScrollObserver from '@/components/ScrollObserver.vue';
const { store } = useLotteryData()
const props = withDefaults(defineProps<{
  class?: string
  gameData: iGameDataTransObject
}>(), {});

store.setCurrentGame(props.gameData);

const { computedDatas, refresh, loadRef, appendNextPage, hasMore } = usePagination(
  (pagination: iPaginationData) => useApi("base").getLotterys(+(props.gameData?.id || 21), pagination), 
  { PageIndex: 1, PageSize: 15 },
  {
    cacheKey: `lotteryRecords-page-${props.gameData?.id}`,
    mapData: applyRecordData.bind(null, props.gameData?.showSpecial || false),
    shouldAppend: true
  }
);

const tabs: iTabData[] = props.gameData?.filter?.map(f => ({ key: f.type, name: f.name })) || [] as iTabData[]
const currentTab = ref(tabs[0]?.key ?? '');
const readmore = () => {
  appendNextPage()
}

onMounted(() => {
  refresh()
})

</script>

<style scoped>
.loading-container {
  @apply w-full flex flex-col items-center justify-center p-4 fixed inset-0 bg-black/80 z-50;
}

.spinner {
  @apply w-4 h-4 rounded-full border-[2px] border-[#f2f3f3] border-t-[#3498db] animate-spin;
  
}

/deep/ .tab-item {
  @apply flex-1 text-center;
}

/deep/ .tab-item .tab-name {
  @apply bg-gray-200 text-gray-600 rounded-full inline-block text-xs px-2 py-0.5 cursor-pointer;
}

/deep/ .tab-item.tab-active .tab-name {
  @apply bg-theme text-white;
}
</style>