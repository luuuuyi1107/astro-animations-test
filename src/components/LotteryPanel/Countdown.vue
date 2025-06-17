<template>
  <span :class="customClass" :id="id">
    {{ displayText }}
  </span>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useLotteryStore } from '@/store/lottery'
import { setupPinia } from '@/libs/pinia-setup'

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

// 设置 Pinia
setupPinia()
const store = useLotteryStore()

// 响应式数据
const displayText = ref(props.initialText)
const remainingSeconds = ref(0)
const timerId = ref<NodeJS.Timeout | null>(null)
const isRunning = ref(false)

// 计算属性
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
    // 如果已经结束，直接显示结束文本并触发回调
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

// 停止倒计时
function stop(): void {
  if (timerId.value) {
    clearInterval(timerId.value)
    timerId.value = null
  }
  isRunning.value = false
}

// 重置倒计时
function reset(): void {
  stop()
  displayText.value = props.initialText
  remainingSeconds.value = 0
}

// 获取剩余秒数
function getRemainingSeconds(): number {
  return remainingSeconds.value
}

// 检查是否正在运行
function getIsRunning(): boolean {
  return isRunning.value
}

// 监听 store.timeUntilEnd 变化
watch(
  () => store.timeUntilEnd,
  (newTime) => {
    if (newTime !== undefined && newTime !== null) {
      // 当时间更新时，重新开始倒计时
      start()
    }
  },
  { immediate: false }
)

// 组件挂载时
onMounted(() => {
  // 初始化倒计时
  start()
})

// 组件卸载时清理
onUnmounted(() => {
  stop()
})

// 暴露方法给父组件
defineExpose({
  start,
  stop,
  reset,
  getRemainingSeconds,
  isRunning: getIsRunning
})
</script>

<style scoped>
/* 如果需要特定样式可以在这里添加 */
</style>