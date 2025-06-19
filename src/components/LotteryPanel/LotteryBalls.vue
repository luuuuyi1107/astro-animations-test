<template>
  <div class="flex items-center space-x-2">
    <div 
      v-for="(ball, index) in regularBalls" 
      :key="`ball-${index}`"
      :class="['ball', ball.color || getColorByNumber(+ball.num), ballClass || '']"
    >
      <div class="num">{{ ball.num }}</div>
      <div v-if="store.currentGame.showText" class="text" :class="[textClass || '']">{{ ball.text }}</div>
    </div>
    
    <template v-if="store.currentGame.showSpecial && specialBall">
      <div class="ball-separator">+</div>
      <div :class="['ball', specialBall.color || getColorByNumber(+specialBall.num), ballClass || '']">
        <div class="num">{{ specialBall.num }}</div>
        <div v-if="store.currentGame.showText" class="text" :class="[textClass || '']">{{ specialBall.text }}</div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { getColorByNumber } from "@/libs/Common";
import { useLotteryData } from "@/components/LotteryPanel/common";
import { computed } from "vue";
const { store } = useLotteryData()



interface Props {
  balls: iBallData[]
  ballClass?: string
  textClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  ballClass: '',
  textClass: '',
})

const specialBall = computed(() => {
  return store.currentGame?.showSpecial
    ? props.balls.length > 0
      ? props.balls[props.balls.length - 1]
      : null
    : null;
});

const regularBalls = computed(() => {
  return store.currentGame?.showSpecial
    ? props.balls.slice(0, props.balls.length - 1)
    : props.balls;
});
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