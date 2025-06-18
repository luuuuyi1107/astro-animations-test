<template>
  <div class="flex items-center space-x-2">
    <div 
      v-for="(ball, index) in balls" 
      :key="`ball-${index}`"
      :class="['ball', ball.color || getColorByNumber(+ball.num), ballClass || '']"
    >
      <div class="num">{{ ball.num }}</div>
      <div class="text" :class="[textClass || '']">{{ ball.text }}</div>
    </div>
    
    <template v-if="showSpecialBall && specialBall">
      <div class="ball-separator">+</div>
      <div :class="['ball', specialBall.color || getColorByNumber(+specialBall.num), ballClass || '']">
        <div class="num">{{ specialBall.num }}</div>
        <div class="text" :class="[textClass || '']">{{ specialBall.text }}</div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { getColorByNumber } from "@/libs/Common";
interface Props {
  balls: iBallData[]
  specialBall?: iBallData | null
  showSpecialBall?: boolean | null | undefined
  ballClass?: string
  textClass?: string
}

defineProps<Props>()
</script>

<style scoped>
.ball {
  .num {
    @apply w-5 h-5 rounded-full text-white text-center leading-5 text-xs bg-red-600 mx-auto;
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
    @apply text-center;
  }
}

.ball-separator {
  @apply mx-2 text-lg font-bold;
}
</style>