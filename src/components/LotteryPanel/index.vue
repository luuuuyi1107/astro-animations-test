<template>
  <div :class="props.class">
    <div class="text-[13px]">
      <div class="flex justify-between items-center w-full">
        <div>
          <span id="lastKaiGameID" class="font-[600] mr-1">{{ store.OpenLottery?.LastKai?.GameID }}</span>
          期开奖结果
        </div>
        <div class="text-red-400">余额: <span v-text="store.UserData?.Money || '0.00'"  />元</div>
      </div>
      <NewestRecord :ballLength="6" :showSpecialBall="showSpecial || false"  />
      <div class="border-y border-gray-200 py-2 mt-2 leading-none">
        <span id="newKaiGameID" class="font-[600] mr-1">{{ store.OpenLottery?.NewKai?.GameID }}</span>
        投注截止时间 
        <Countdown id="countDown"  @countdown-end="startPolling"  />
      </div>
      <Tabs :tabs="tabs"  @change="onTabChange" />
      <component 
        :is="currentTab === 'tab2' ? GameRecord : currentTab === 'tab3' ? BetRecord : null" 
        class="tab-content"
        :id="props.id"
        :showSpecialBall="showSpecial || false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { getSessionStorageData } from "@/libs/Common";
  import { ref, onMounted, onUnmounted } from 'vue'
  import { lotteryStatusEnum } from "@/libs/constants";
  import { useLotteryData } from "./common.ts"
  import BetRecord from "./BetRecord.vue"
  import Countdown from '@/components/LotteryPanel/Countdown.vue'
  import GameRecord from "./GameRecord.vue"
  import NewestRecord  from '@/components/LotteryPanel/NewestRecord.vue'
  import Tabs from '@/components/Tabs.vue'

  type Props = {
    id: string | number
    showSpecial?: boolean
    class?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    id: '21',
    class: ''
  })

  const cachedData = getSessionStorageData(`lottery-${props.id}`);
  const { store } = useLotteryData(cachedData)
  const pollCount = ref(0)
  const maxPollCount = ref(10)
  const pollInterval = ref(3000) // 3秒
  const isPolling = ref(false)
  const pollTimer = ref<NodeJS.Timeout | null>(null)
  const tabs = [
    { key: 'tab1', name: '彩种介绍' },
    { key: 'tab2', name: '开奖记录' },
    { key: 'tab3', name: '投注记录' }
  ]
  const currentTab = ref('')

  const startPolling = () => {
    if (isPolling.value || pollCount.value >= maxPollCount.value) {
      return
    }

    isPolling.value = true
    pollTimer.value = setTimeout(async () => {
      try {
        pollCount.value++
        console.log(`执行第 ${pollCount.value} 次轮询`)
        // 重新获取数据
        await store.fetchLotteryDataById(+props.id)
        // 检查是否需要继续轮询
        if ((store.timeUntilEnd ?? 0) <= 0 && pollCount.value < maxPollCount.value) {
          isPolling.value = false
          startPolling() // 递归调用下一次轮询
        } else {
          store.setLotteryState(lotteryStatusEnum.COUNTING)
          stopPolling() // 停止轮询
        }
      } catch (error) {
        console.error('轮询过程中发生错误:', error)
        stopPolling()
      }
    }, pollInterval.value)
  }

  // 停止轮询
  const stopPolling = () => {
    if (pollTimer.value) {
      clearTimeout(pollTimer.value)
      pollTimer.value = null
    }
    isPolling.value = false
    console.log(`轮询结束，总共执行了 ${pollCount.value} 次`)
  }

  const onTabChange = (key: string | number) => {
    if (key === 'tab1') {
      window.open('/article', '_self')
      return
    }
    currentTab.value = key as string
  }

  onMounted(async () => {
    try {
      await store.fetchLotteryDataById(+props.id)
      // 如果初始状态就是时间结束，立即开始轮询
      if ((store.timeUntilEnd ?? 0) <= 0) {
        startPolling()
      }
    } catch (error) {
      console.error('初始化数据失败:', error)
    }
  })

  onUnmounted(() => {
    stopPolling()
    
  })

</script>