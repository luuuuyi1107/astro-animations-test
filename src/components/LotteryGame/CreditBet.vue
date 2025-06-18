<template>
  <div v-if="betTab === 'credit'" class="mt-[11px]">
    <div class="my-[6px] mx-[10px] border-l-[3px] border-l-[#f77e04] pl-[5px] text-[13px]">特码投注</div>
    <div class="flex items-start gap-[11px] px-[10px] py-[10px] w-full" v-if="betData.length > 0">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-[15px] font-[700] text-[13px] mb-[5px]">
          <div class="ml-[7px]">号码</div>
          <div class="">赔率</div>
          <div class="">金额</div>
        </div>
        <div class="flex items-center gap-[13px] h-[31px] min-w-0" v-for="(bet, index) in betData.slice(0, 25)" :key="index">
          <div class="text-[13px] number-circle" :class="[colorFilter(bet.number), {'active': bet.amount}]">{{ paddingZero(bet.number) }}</div>
          <div class="text-[12px] text-[#f77e04]">{{ LotteryRate.Rate['Tm_' + paddingZero(bet.number)] }}</div>
          <input type="text" class="flex-1 h-[28px] px-[5px] border border-[#ddd] text-[13px] outline-none min-w-0" v-model="bet.amount" @input="bet.amount = bet.amount.replace(/[^0-9-]+/, '')" @change="setBetAmountTotal()" />
        </div>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-[15px] font-[700] text-[13px] mb-[5px]">
          <div class="ml-[7px]">号码</div>
          <div class="">赔率</div>
          <div class="">金额</div>
        </div>
        <div class="flex items-center gap-[13px] h-[31px] min-w-0" v-for="(bet, index) in betData.slice(25, 49)" :key="index">
          <div class="text-[13px] number-circle" :class="[colorFilter(bet.number), {'active': bet.amount}]">{{ paddingZero(bet.number) }}</div>
          <div class="text-[12px] text-[#f77e04]">{{ LotteryRate.Rate['Tm_' + paddingZero(bet.number)] }}</div>
          <input type="text" class="flex-1 h-[28px] px-[5px] border border-[#ddd] text-[13px] outline-none min-w-0" v-model="bet.amount" @input="bet.amount = bet.amount.replace(/[^0-9-]+/, '')" @change="setBetAmountTotal()" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLotteryStore } from '@/store/lottery'
import { computed, ref, type Ref, watch } from 'vue'
import { setupPinia } from '@/libs/pinia-setup'
import { red, blue, green } from '@/libs/game/lhc'


// 使用正確的 Pinia 設置
setupPinia()
const store = ref(useLotteryStore())
const betTab = computed(() => store.value.betTab)
const LotteryRate = computed(() => store.value.LotteryRate)

const totalNumber = 49
const betData: Ref<{ number: number, amount: string }[]> = ref([])
const clearBet = computed(() => store.value.clearBet)

const colorFilter = (num: number) => {
  if (red.includes(num)) return 'red-circle'
  if (blue.includes(num)) return 'blue-circle'
  if (green.includes(num)) return 'green-circle'
  return ''
}
const paddingZero = (num: number) => {
  return num.toString().padStart(2, '0')
}

const setBetAmountTotal = () => {
  let totalAmount = 0
  let totalBets = 0
  betData.value.forEach(bet => {
    totalAmount += Number(bet.amount)
    if (bet.amount) {
      console.log(bet)
      totalBets += 1
    }
  })
  store.value.setBetAmount(totalAmount.toString())
  store.value.setTotalBets(totalBets)
}

const cleanBetData = () => {
  betData.value = []
  for (let i = 0; i < totalNumber; i++) {
    betData.value.push({
      number: i + 1,
      amount: '',
    })
  }
}

watch(betTab, () => {
  cleanBetData()
})

watch(clearBet, (newVal) => {
  if (newVal) {
    cleanBetData()
  }
})
</script>
<style scoped>
.number-circle {
  min-width: 29px;
  width: 29px;
  height: 29px;
  line-height: 29px;
  text-align: center;
  border-radius: 50%;
  border: 1px solid #ddd;
  color: #f77e04;
  font-size: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center; 
  margin-left: 5px;
}
.red-circle {
  color: #d32626;
}
.red-circle.active {
  color: #fff;
  background-color: #d32626;
}
.blue-circle {
  color: #3232fb;
}
.blue-circle.active {
  color: #fff;
  background-color: #3232fb;
}
.green-circle {
  color: #26a126;
}
.green-circle.active {
  color: #fff;
  background-color: #26a126;
}
</style>