<template>
  <div class="mt-1">

    <div
        v-if="loadRef && computedDatas.length === 0"
        class="loading-container"
      >
        <div class="spinner"></div>
      </div>

    <div v-for="(record, index) in computedDatas"
          :key="record.GameID + index"
          class="flex items-center bg-gray-100 odd:bg-white space-x-2 py-1"
    >
      <div>{{ formatDate(record.OpenTime, "HH:mm") }}</div>
      <div>{{ record.GameID }}期</div>
      <div v-if="computedDatas" class="flex-1">
        <LotteryBalls :showSpecialBall="showSpecialBall" :balls="record.balls" :specialBall="record.specialBall" ballClass="flex-1 text-xs" textClass="text-gray-400 text-xs" />
      </div>
      
    </div>
    <div v-if="computedDatas" class="flex justify-center items-center text-xs text-gray-500 bg-gray-100 py-3 cursor-pointer gap-1" @click="readmore">
      更多
      <svg class="rotate-180" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 20" width="8.5" height="10">
        <path id="Shape 1" class="s0" d="m9.5 0.4c-0.6-0.5-1.4-0.5-2 0l-7.1 7.1c-0.5 0.6-0.5 1.5 0 2 0.6 0.6 1.5 0.6 2 0l4.7-4.7v13.6c0 0.8 0.6 1.4 1.4 1.4 0.8 0 1.4-0.6 1.4-1.4v-13.6l4.7 4.7c0.5 0.6 1.4 0.6 2 0 0.5-0.6 0.5-1.4 0-2 0 0-7.1-7.1-7.1-7.1z"/>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useApi } from "@/libs/Api";
import { onBeforeUnmount, onMounted } from "vue";
import { ZodiacnimalMap } from "@/libs/constants"
import { formatDate, getGameDataById } from "@/libs/Common";
import { useLotteryData, usePagination } from "./common";
import LotteryBalls from './LotteryBalls.vue'


const { onLotteryDataChange } = useLotteryData()
const props = withDefaults(defineProps<{
  id?: string | number
  showSpecialBall?: boolean | null
}>(), {
  id: '21',
  showSpecialBall: true
});

const applyRecordData = (record: iLotteryRecordData): ProcessedLotteryRecord => {
  const ballNum = record.OpenCode.split(',').map(num => +num);
  if (ballNum.length === 0) {
    return { ...record, balls: [], specialBall: null };
  }
  const convertBallData = (num: number) => ({
    num: num.toString(),
    text: ZodiacnimalMap[num % 12] || num.toString(),
  });

  const balls = ballNum.slice(0, props.showSpecialBall ? -1 : ballNum.length).map(convertBallData);
  const specialBall = props.showSpecialBall
    ? ballNum.slice(-1).map(convertBallData)[0] || null
    : null

  return {
    ...record,
    balls,
    specialBall
  }
}

const { computedDatas, refresh, loadRef } = usePagination(
  (pagination: iPaginationData) => useApi("base").getLotterys(+props.id, pagination), 
  { PageIndex: 1, PageSize: 5 },
  {
    cacheKey: `lotteryRecords-${props.id}`,
    mapData: applyRecordData,
  }
);

const unsubscribe = onLotteryDataChange(async () => {
  refresh()
});

const readmore = async () => {
  const { key } = getGameDataById(+props.id)
  window.open(`/game_records/${key}`, "_self")
}

onMounted(() => {
  refresh()
})

onBeforeUnmount(() => {
  if (unsubscribe) unsubscribe();
})
</script>

<style scoped>
.loading-container {
  @apply w-full flex flex-col items-center justify-center p-4;
}

.spinner {
  @apply w-4 h-4 rounded-full border-[2px] border-[#f2f3f3] border-t-[#3498db] animate-spin;
  
}
</style>