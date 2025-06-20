<template>
  <div class="flex justify-between items-center py-[5px] px-[10px]">
    <div class="flex items-center gap-[5px]">
      <div class="text-[10px] py-1 px-2 rounded-[2px] border border-[#ddd] text-[#2c3e50] cursor-pointer" :class="{ '!border-[#f77e04] bg-[#f77e04] !text-white': betTab === 'quick' }" @click="setBetTab('quick')">快捷投注</div>
      <div class="text-[10px] py-1 px-2 rounded-[2px] border border-[#ddd] text-[#2c3e50] cursor-pointer" :class="{ '!border-[#f77e04] bg-[#f77e04] !text-white': betTab === 'credit' }" @click="setBetTab('credit')">信用投注</div>
    </div>
    <div class="cursor-pointer" @click="clearBet">
      <img src="/assets/icons/delete_btn.png" alt="" class="w-[30px] h-[30px]" />
    </div>
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

const setBetTab = (tab: string) => {
  store.value.setBetTab(tab)
}

const clearBet = () => {
  store.value.setClearBet(true)
}
</script>