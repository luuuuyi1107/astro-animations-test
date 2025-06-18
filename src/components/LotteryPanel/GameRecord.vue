<template>
  <div class="mt-1">

    <div 
        v-if="isLoading" 
        class="loading-container"
      >
        <div class="spinner"></div>
      </div>

    <div v-for="(record, index) in records" 
          :key="record.GameID + index"
          class="flex items-center bg-gray-100 odd:bg-white space-x-2 py-1"
          
    >
      <div>{{ formatDate(record.OpenTime, "HH:mm") }}</div>
      <div>{{ record.GameID }}期</div>
      <div v-if="records" class="flex-1">
        <LotteryBalls :showSpecialBall="showSpecialBall" :balls="record.balls" :specialBall="record.specialBall" ballClass="flex-1 text-xs" textClass="text-gray-400 text-xs" />
      </div>
      
    </div>
    <div v-if="records" class="flex justify-center items-center text-xs text-gray-500 bg-gray-100 py-3 cursor-pointer" @click="$emit('click')">
      更多
      <svg 
        class="arrow-icon"
        width="10" 
        height="6" 
        viewBox="0 0 10 6"
      >
        <path 
          d="M0.5 0.5L5 5L9.5 0.5" 
          stroke="#999" 
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useApi } from "@/libs/Api";
import { onMounted, ref } from "vue";
import LotteryBalls from './LotteryBalls.vue'
import { ZodiacnimalMap } from "@/libs/constants"
import { formatDate, getSessionStorageData, setSessionStorageData } from "@/libs/Common";

interface ProcessedLotteryRecord extends iLotteryRecordData {
  balls: iBallData[]
  specialBall: iBallData | null
}

const props = withDefaults(defineProps<{
  id?: string | number
  showSpecialBall?: boolean | null
}>(), {
  id: '21',
  showSpecialBall: true
});

const records = ref<ProcessedLotteryRecord[] | null>(null);
const isLoading = ref(false);

const fetchData = async () => {
  
  try {
    const data = await useApi("base").getLotterys({ lotteryid: +props.id,
    date: 0,
    PageIndex: 1,
    PageSize: 5 });
    if (data.Code !== 1) throw new Error(data.Message);
    if (!data.Data || !Array.isArray(data.Data)) {
      throw new Error("数据格式不正确");
    }

    setSessionStorageData(`lotteryRecords-${props.id}`, data.Data);
    records.value = data.Data.map(applyRecordData)

  } catch (error) {
    console.error("获取数据失败:", error);
  } finally {
    isLoading.value = false;
  }
}

const applyRecordData = (record: iLotteryRecordData): ProcessedLotteryRecord => {
  const ballNum = record.OpenCode.split(',').map(num => +num);
  if (ballNum.length === 0) {
    return { ...record, balls: [], specialBall: null };
  }
  const convertBallData = (num: number) => ({
    num: num.toString(),
    text: ZodiacnimalMap[num % 12 - 1] || num.toString(),
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


onMounted(() => {
  const cachedData = getSessionStorageData(`lotteryRecords-${props.id}`);
  if (cachedData) {
    records.value = cachedData.map(applyRecordData);
  } else {
    isLoading.value = true;
  }
  
  fetchData()
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