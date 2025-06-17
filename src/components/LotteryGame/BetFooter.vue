<template>
    <div class="bg-white fixed bottom-0 left-0 right-0 z-10 shadow-[0_-1px_3px_rgba(0,0,0,.1)]">
        <div class="p-[10px] flex justify-between items-center">
            <div class="flex items-center gap-[10px] flex-1">
                <div
                    v-for="item in betAmountList"
                    :key="item.amount"
                    class="px-[10px] py-[7px] rounded-[50px] border-[1px] border-[#ccc] text-xs cursor-pointer font-[700]"
                    :class="{ 'bg-[#f77e04] text-white border-[#f77e04]': betAmount === item.amount.toString() }"
                    @click="setBetAmount(item.amount)"
                >
                    {{ item.amount }}元
                </div>
            </div>
            <div class="text-xs ml-1 bg-gray-200 rounded-[50px] px-[12.5px] py-[11px] font-[600] ml-1 cursor-pointer">
                编辑金额
            </div>
        </div>
        <div class="flex justify-between items-center bg-[#333]">
            <div class="text-white w-[60px] h-[50px] flex justify-center items-center border-r-[1px] border-[#666] text-[16px] cursor-pointer" @click="clearBetAmount">清空</div>
            <div class="flex-1 flex items-center pl-[5px] gap-[5px]">
                <input
                    type="number"
                    placeholder="金额"
                    class="w-[70px] h-[30px] border-[#ccc] border-solid rounded-[2px] pl-[6px] font-[700] text-sm"
                    v-model="betAmount"
                />
                <div class="flex flex-col justify-center">
                    <div class="text-white text-xs">共0注, 0元</div>
                    <div class="text-[#999] text-xs">请设置金额</div>
                </div>
            </div>
            <div class="text-white bg-[#f77e04] flex justify-center items-center w-[70px] h-[50px] font-[700] text-[18px] cursor-pointer">
                投注
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useLotteryStore } from '@/store/lottery'
import { computed, onMounted, ref } from 'vue'

// 創建響應式引用
const store = ref(useLotteryStore())
const betAmountList = computed(() => store.value.betAmountList)
const betAmount = computed(() => store.value.betAmount)

const setBetAmount = (amount: number) => {
  store.value.setBetAmount(amount.toString())
}

const clearBetAmount = () => {
  store.value.setBetAmount('')
}

// 在組件掛載後確保 store 已初始化
onMounted(() => {
  store.value = useLotteryStore()
})
</script>