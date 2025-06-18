<template>
  <div v-if="betTab === 'quick'">
    <div>QuickBet</div>
  </div>
</template>

<script setup lang="ts">
import { useLotteryStore } from '@/store/lottery'
import { computed, ref } from 'vue'
import { setupPinia } from '@/libs/pinia-setup'

// 使用正確的 Pinia 設置
setupPinia()
const store = ref(useLotteryStore())
const betTab = computed(() => store.value.betTab)

</script>