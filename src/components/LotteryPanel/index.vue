<template>
  <div :class="props.class">
    <div class="data-container text-[13px]">
      <div class="flex justify-between items-center w-full">
        <div>
          <span id="lastKaiGameID" class="font-[600] mr-1" v-text="store.OpenLottery?.LastKai?.GameID || '2025000'" />
          期开奖结果
        </div>
        <div class="text-red-400">余额: <span v-text="store.UserData?.Money || '0.00'"  />元</div>
      </div>
      <Balls :ballLength="6" />
      <div class="border-y border-gray-200 py-2 mt-2 leading-none">
        <span id="newKaiGameID" class="font-[600] mr-1" v-text="store.OpenLottery?.NewKai?.GameID || '2025000'" />
        投注截止时间
        <Countdown id="countDown" endText="开奖中..." />
      </div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
  import { getSessionStorageData } from "@/libs/Common";
  import { useLotteryStore } from "@/store/lottery"
  import { ref, watch, onMounted, onUnmounted } from 'vue'
  import { setupPinia } from "@/libs/pinia-setup"
  import Balls  from '@/components/LotteryPanel/Balls.vue'
  import Countdown from '@/components/LotteryPanel/Countdown.vue'

  type Props = {
    id: string
    class?: string
  }

  setupPinia()
  // 创建响应式引用
  const store = ref(useLotteryStore())
  const props = withDefaults(defineProps<Props>(), {
    id: '21',
    class: ''
  })

  // 轮询相关状态
  const pollCount = ref(0)
  const maxPollCount = ref(10)
  const pollInterval = ref(3000) // 3秒
  const isPolling = ref(false)
  const pollTimer = ref<NodeJS.Timeout | null>(null)

  // 初始化数据
  const cachedData = getSessionStorageData(`lottery-${props.id}`);
  if (cachedData) {
    store.value.setGetPush(cachedData);
  }

  // 轮询函数
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
        await store.value.fetchLotteryDataById(+props.id)
        // 检查是否需要继续轮询
        if ((store.value.timeUntilEnd ?? 0) <= 0 && pollCount.value < maxPollCount.value) {
          isPolling.value = false
          startPolling() // 递归调用下一次轮询
        } else {
          // 停止轮询
          stopPolling()
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

  // 重置轮询状态
  const resetPolling = () => {
    stopPolling()
    pollCount.value = 0
    isPolling.value = false
  }

  // 监听 timeUntilEnd 变化
  watch(() => store.value.timeUntilEnd, (newValue, oldValue) => {
    console.log(`timeUntilEnd 变化: ${oldValue} -> ${newValue}`)
    if (newValue) return
    if ((newValue ?? 0) <= 0 && !isPolling.value && pollCount.value < maxPollCount.value) {
      console.log('检测到时间结束，开始轮询')
      startPolling()
    } else if ((newValue ?? 0) > 0 && isPolling.value) {
      console.log('检测到时间恢复，停止轮询')
      resetPolling()
    }
  }, { immediate: true })

  // 组件挂载时初始化
  onMounted(async () => {
    try {
      await store.value.fetchLotteryDataById(+props.id)
      // 如果初始状态就是时间结束，立即开始轮询
      if ((store.value.timeUntilEnd ?? 0) <= 0) {
        startPolling()
      }
    } catch (error) {
      console.error('初始化数据失败:', error)
    }
  })

  // 组件卸载时清理
  onUnmounted(() => {
    stopPolling()
  })

</script>