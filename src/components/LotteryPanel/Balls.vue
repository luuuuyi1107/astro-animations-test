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
      <template v-if="showSpecialBall && specialBall">
        <div class="ball-separator">+</div>
        
        <div :class="['ball', specialBall.color]">
          <div class="num">{{ specialBall.num }}</div>
          <div class="text">{{ specialBall.text }}</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useLotteryData } from "./common.ts"
import { lotteryStatusEnum, ZodiacnimalMap } from "@/libs/constants"
import { getRandomNumber, getColorByNumber } from "@/libs/Common"

const { store, onStateChange } = useLotteryData()

// Props 定义
interface Props {
  ballLength?: number
  showSpecialBall?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  ballLength: 6,
  showSpecialBall: true
})
// 常数
const ANIMATION_DURATION = 500 // 动画间隔时间 (毫秒)
// 响应式数据
const balls = ref<iBallData[]>([])
const specialBall = ref<iBallData>()
const animationInterval = ref<NodeJS.Timeout | null>(null)
const isAnimating = ref(false)

// 创建球数据
function createiBallData(num?: string): iBallData {
  const _num = num || getRandomNumber(1, 49).toString()
  const numValue = parseInt(_num)
  
  return {
    num: _num,
    text: ZodiacnimalMap[numValue % 12] || "",
    color: getColorByNumber(numValue)
  }
}

// // 初始化球阵列
function initializeBalls(): void {
  balls.value = Array.from({ length: props.ballLength }, () => createiBallData());
  if (props.showSpecialBall) specialBall.value = createiBallData()
}

// 更新所有球
function updateAllBalls(): void {
  balls.value = balls.value.map(() => createiBallData())
  if (props.showSpecialBall) specialBall.value = specialBall.value = createiBallData()
}

// 根据开奖结果更新球
function updateBallsWithResult(kaiText: string): void {
  const ballNums = kaiText.split(",")
  const regularBalls = ballNums.slice(0, (props.showSpecialBall ? -1 : ballNums.length))
  balls.value = regularBalls.map((_, index) => {
    const num = ballNums[index]
    return num ? createiBallData(num) : createiBallData()
  })
  
  if (!props.showSpecialBall) return
  const specialNum = ballNums[ballNums.length - 1]
  specialBall.value = specialNum ? createiBallData(specialNum) : createiBallData()
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