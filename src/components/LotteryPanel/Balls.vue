<template>
  <div class="lottery-balls-container">  
    <div class="flex items-center space-x-2">
      <div 
        v-for="(ball, index) in balls" 
        :key="`ball-${index}`"
        :class="['ball', ball.color]"
      >
        <div class="num">{{ ball.num }}</div>
        <div class="text">{{ ball.text }}</div>
      </div>
      
      <div class="ball-separator">+</div>
      
      <div :class="['ball', specialBall.color]">
        <div class="num">{{ specialBall.num }}</div>
        <div class="text">{{ specialBall.text }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useLotteryStore } from '@/store/lottery'
import { setupPinia } from '@/libs/pinia-setup'
import { ZodiacnimalMap } from "@/libs/constants"


// Props 定义
interface Props {
  ballLength?: number
}

const props = withDefaults(defineProps<Props>(), {
  ballLength: 6
})

// 设置 Pinia
setupPinia()
const store = useLotteryStore()

// 常数
const ANIMATION_DURATION = 500 // 动画间隔时间 (毫秒)

// 球的数据结构
interface BallData {
  num: string
  text: string
  color: string
}

// 响应式数据
const balls = ref<BallData[]>([])
const specialBall = ref<BallData>({ num: '0', text: '', color: 'red' })
const animationInterval = ref<NodeJS.Timeout | null>(null)
const isAnimating = ref(false)

// 生成随机数字
function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// 根据数字获取颜色
function getColorByNumber(num: number): string {
  const _num = num % 3
  return _num === 0 ? "red" : _num === 1 ? "green" : "blue"
}

// 创建球数据
function createBallData(num?: string): BallData {
  const _num = num || getRandomNumber(1, 49).toString()
  const numValue = parseInt(_num)
  
  return {
    num: _num,
    text: ZodiacnimalMap[numValue % 12] || "",
    color: getColorByNumber(numValue)
  }
}

// 初始化球阵列
function initializeBalls(): void {
  balls.value = Array.from({ length: props.ballLength }, () => createBallData())
  specialBall.value = createBallData()
}

// 更新所有球
function updateAllBalls(): void {
  balls.value = balls.value.map(() => createBallData())
  specialBall.value = createBallData()
}

// 根据开奖结果更新球
function updateBallsWithResult(kaiText: string): void {
  const ballNums = kaiText.split(",")
  
  // 更新普通球
  balls.value = balls.value.map((_, index) => {
    const num = ballNums[index]
    return num ? createBallData(num) : createBallData()
  })
  
  // 更新特别球（最后一个数字）
  const specialNum = ballNums[props.ballLength]
  specialBall.value = specialNum ? createBallData(specialNum) : createBallData()
}

// 开始动画
function startAnimation(): void {
  if (isAnimating.value) return
  
  isAnimating.value = true
  updateAllBalls()
  animationInterval.value = setInterval(updateAllBalls, ANIMATION_DURATION)
}

// 停止动画
function stopAnimation(): void {
  if (!isAnimating.value) return
  
  if (animationInterval.value) {
    clearInterval(animationInterval.value)
    animationInterval.value = null
  }
  isAnimating.value = false
}

// 监听页面可见性变化
function handleVisibilityChange(): void {
  if (document.hidden && isAnimating.value) {
    if (animationInterval.value) {
      clearInterval(animationInterval.value)
      animationInterval.value = null
    }
  } else if (!document.hidden && isAnimating.value) {
    updateAllBalls()
    animationInterval.value = setInterval(updateAllBalls, ANIMATION_DURATION)
  }
}

// 监听 store 变化
watch(
  () => store.OpenLottery?.LastKai?.KaiText,
  (kaiText) => {
    if (kaiText) {
      stopAnimation()
      updateBallsWithResult(kaiText)
    } else {
      startAnimation()
    }
  },
  { immediate: true }
)
initializeBalls()
// 组件挂载
onMounted(() => {
  
  
  // 检查初始状态
  if (store.OpenLottery?.LastKai?.KaiText) {
    updateBallsWithResult(store.OpenLottery.LastKai.KaiText)
  } else {
    startAnimation()
  }
  
  // 添加页面可见性监听
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

// 组件卸载
onUnmounted(() => {
  stopAnimation()
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})


</script>



<style scoped>
.lottery-balls-container .ball {
  .num {
    @apply w-5 h-5 rounded-full text-white text-center leading-5 text-xs bg-red-600;
  }

  &.blue .num {
    @apply bg-blue-600;
  }
  &.green .num {
    @apply bg-green-600;
  }
  &.red .num {
    @apply bg-red-600;
  }

  .text {
    @apply text-center min-h-5;
  }
}

.ball-separator {
  @apply mx-2 text-lg font-bold;
}
</style>