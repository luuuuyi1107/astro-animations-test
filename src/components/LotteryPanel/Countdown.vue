<template>
  <span :class="customClass" :id="id">
    {{ displayText }}
  </span>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useLotteryData } from "./common.ts"

// Props 定义
export interface Props {
  id?: string
  class?: string
  endTimeCallback?: () => void
  initialText?: string
  endText?: string
}
const props = withDefaults(defineProps<Props>(), {
  id: 'countDown',
  class: 'text-red-600',
  initialText: '00:00:00',
  endText: '开奖中...'
})

const { store } = useLotteryData()
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
    
    // 触发结束回调
    if (props.endTimeCallback) {
      props.endTimeCallback()
    }
    
    // 触发自定义事件
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
    if (props.endTimeCallback || callback) {
      const finalCallback = callback || props.endTimeCallback
      if (finalCallback) {
        finalCallback()
      }
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

// 组件挂载时
onMounted(() => {
  start()

  store.$subscribe(() => {
    if (isRunning.value) return
    start()
  })

})

// 组件卸载时清理
onUnmounted(() => {
  stop()
})

</script>
