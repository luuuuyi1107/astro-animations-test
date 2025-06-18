<template>
  <span :class="customClass" :id="id">
    {{ displayText }}
  </span>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useLotteryData } from "./common.ts"
import { lotteryStatusEnum } from '@/libs/constants.ts'

// Props 定义
export interface Props {
  id?: string
  class?: string
  endTimeCallback?: () => void
  initialText?: string
  openingText?: string
  endText?: string
}
const props = withDefaults(defineProps<Props>(), {
  id: 'countDown',
  class: 'text-red-600',
  initialText: '00:00:00',
  openingText: '开奖中...',
  endText: '封盘中...'
})

const { store, onStateChange, onLotteryDataChange } = useLotteryData()
const displayText = ref(props.initialText)
const remainingSeconds = ref(0)
const timerId = ref<NodeJS.Timeout | null>(null)
const isRunning = ref(false)
const customClass = computed(() => props.class)

// Emits 定义
const emit = defineEmits<{
  'countdown-end': [countdownId: string]
}>()

// 格式化倒数时间为 HH:MM:SS
function formatCountdown(totalSeconds: number): string {
  if (totalSeconds <= 0) return '00:00:00'
  
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = Math.floor(totalSeconds % 60)
  
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0')
  ].join(':')
}

// 倒计时 tick 函数
function tick(): void {
  remainingSeconds.value--
  // 更新显示
  displayText.value = formatCountdown(Math.max(0, remainingSeconds.value))
  // 检查是否结束
  if (remainingSeconds.value <= 0) {
    stop()
    displayText.value = props.endText
    store.setLotteryState(lotteryStatusEnum.END)
    emit('countdown-end', props.id)
  }
}

// 开始倒计时
function start(callback?: () => void): void {
  // 停止现有计时器
  stop()
  // 设置剩余秒数
  remainingSeconds.value = Math.max(0, Math.floor((store.timeUntilEnd || 0) / 1000))
  // 立即更新显示
  displayText.value = formatCountdown(remainingSeconds.value)
  
  // 开始计时器
  if (remainingSeconds.value > 0) {
    isRunning.value = true
    timerId.value = setInterval(tick, 1000)
  } else {
    displayText.value = props.endText
    if (callback) {
      callback()
    }
    emit('countdown-end', props.id)
  }
}
function stop(): void {
  if (timerId.value) {
    clearInterval(timerId.value)
    timerId.value = null
  }
  isRunning.value = false
}

const unsubscribeState = onStateChange(() => {
  if (store.LotteryState === lotteryStatusEnum.END) {
    displayText.value = props.endText
  } else if (store.LotteryState === lotteryStatusEnum.OPENING) {
    displayText.value = props.openingText
  } else if (store.LotteryState === lotteryStatusEnum.COUNTING) {
    displayText.value = props.initialText
    start()
  }
})

const unsubscribeDataChange = onLotteryDataChange(() => {
  start()
})

// 组件挂载时
onMounted(() => {
  start()
})

// 组件卸载时清理
onUnmounted(() => {
  stop()
  unsubscribeState()
  unsubscribeDataChange()
})

</script>
