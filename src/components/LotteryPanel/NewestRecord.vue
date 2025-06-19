<template>
  <div class="lottery-balls-container">  
    <LotteryBalls 
      :balls="balls"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useLotteryData } from "./common.ts"
import { lotteryStatusEnum, ZodiacnimalMap } from "@/libs/constants"
import { getRandomNumber } from "@/libs/Common"
import LotteryBalls from './LotteryBalls.vue'

const { store, onStateChange } = useLotteryData()

// Props 定义
interface Props {
  ballLength?: number
  showSpecialBall?: boolean | null
}

const props = withDefaults(defineProps<Props>(), {
  ballLength: 7,
  showSpecialBall: true
})

// 常数
const ANIMATION_DURATION = 500 // 动画间隔时间 (毫秒)

// 响应式数据
const balls = ref<iBallData[]>([])
const animationInterval = ref<NodeJS.Timeout | null>(null)
const isAnimating = ref(false)

// 创建球数据
function createiBallData(num?: string): iBallData {
  const _num = num || getRandomNumber(1, 49).toString()

  return {
    num: _num,
    text: ZodiacnimalMap[+_num % 12] || "",
  }
}

// 初始化球阵列
function initializeBalls(): void {
  balls.value = Array.from({ length: props.ballLength }, () => createiBallData());
}

// 更新所有球
function updateAllBalls(): void {
  balls.value = balls.value.map(() => createiBallData())
}

// 根据开奖结果更新球
function updateBallsWithResult(kaiText: string): void {
  const ballNums = kaiText.split(",")
  balls.value = ballNums.map((_, index) => {
    const num = ballNums[index]
    return num ? createiBallData(num) : createiBallData()
  })
  
  if (!props.showSpecialBall) return
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

initializeBalls()

const unsubscribe = onStateChange((newState) => {

  console.log({ newState })
  console.log({ newState })
  console.log({ newState })
  console.log({ newState })
  if (newState === lotteryStatusEnum.END) {
    startAnimation()
  } else if (newState === lotteryStatusEnum.COUNTING) {
    if (store.OpenLottery?.LastKai?.KaiText) {
      stopAnimation()
      updateBallsWithResult(store.OpenLottery.LastKai.KaiText)
    }
  }
})

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
  unsubscribe();
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<style scoped>
/* 主容器样式，如果需要的话可以在这里添加 */
</style>