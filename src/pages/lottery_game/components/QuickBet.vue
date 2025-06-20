<template>
  <div v-if="betTab === 'quick'">
    <div class="px-[10px] py-[6px] quick-filter">
      <div class="flex justify-between items-center h-[28px]">
        <div class=" border-l-[3px] border-l-[#f77e04] pl-[5px] text-[13px]">特码投注</div>
        <div class="filter-item" :class="{'active': filterOptions.includes('all')}" @click="handleFilter('all')">全</div>
        <div class="flex">
          <div class="filter-item" :class="{'active': filterOptions.includes('big')}" @click="handleFilter('big')">大</div>
          <div class="filter-item" :class="{'active': filterOptions.includes('small')}" @click="handleFilter('small')">小</div>
        </div>
        <div class="flex">
          <div class="filter-item" :class="{'active': filterOptions.includes('single')}" @click="handleFilter('single')">单</div>
          <div class="filter-item" :class="{'active': filterOptions.includes('double')}" @click="handleFilter('double')">双</div>
        </div>
        <div class="flex">
          <div class="filter-item" :class="{'active': filterOptions.includes('red')}" @click="handleFilter('red')">红</div>
          <div class="filter-item" :class="{'active': filterOptions.includes('blue')}" @click="handleFilter('blue')">蓝</div>
          <div class="filter-item" :class="{'active': filterOptions.includes('green')}" @click="handleFilter('green')">绿</div>
        </div>
      </div>
      <div class="flex justify-between items-center mt-[2px]">
        <div class="filter-item !border-none" :class="{'active': filterOptions.includes('shu')}" @click="handleFilter('shu')">鼠</div>
        <div class="filter-item !border-none" :class="{'active': filterOptions.includes('niu')}" @click="handleFilter('niu')">牛</div>
        <div class="filter-item !border-none" :class="{'active': filterOptions.includes('hu')}" @click="handleFilter('hu')">虎</div>
        <div class="filter-item !border-none" :class="{'active': filterOptions.includes('tu')}" @click="handleFilter('tu')">兔</div>
        <div class="filter-item !border-none" :class="{'active': filterOptions.includes('long')}" @click="handleFilter('long')">龙</div>
        <div class="filter-item !border-none" :class="{'active': filterOptions.includes('se')}" @click="handleFilter('se')">蛇</div>
        <div class="filter-item !border-none" :class="{'active': filterOptions.includes('ma')}" @click="handleFilter('ma')">马</div>
        <div class="filter-item !border-none" :class="{'active': filterOptions.includes('yang')}" @click="handleFilter('yang')">羊</div>
        <div class="filter-item !border-none" :class="{'active': filterOptions.includes('hou')}" @click="handleFilter('hou')">猴</div>
        <div class="filter-item !border-none" :class="{'active': filterOptions.includes('ji')}" @click="handleFilter('ji')">鸡</div>
        <div class="filter-item !border-none" :class="{'active': filterOptions.includes('gou')}" @click="handleFilter('gou')">狗</div>
        <div class="filter-item !border-none" :class="{'active': filterOptions.includes('zhu')}" @click="handleFilter('zhu')">猪</div>
      </div>
    </div>
    <div class="grid grid-cols-7 gap-[10px] mt-[10px] pb-[10px] px-[10px]">
      <div class="flex flex-col items-center cursor-pointer" v-for="(bet, index) in betData" :key="index" @click="handleBet(bet)">
        <div class="text-[13px] number-circle" :class="[colorFilter(bet.number), {'active': bet.active}, {'refund': bet.number === 1}]">{{ paddingZero(bet.number) }}</div>
        <div class="text-[13px] text-[#999]">{{ LotteryRate.Rate['Tm_' + paddingZero(bet.number)] }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLotteryStore } from '@/store/lottery'
import { computed, type Ref, ref, watch, onMounted } from 'vue'
import { setupPinia } from '@/libs/pinia-setup'
import { red, blue, green } from '@/libs/game/lhc'

// 使用正確的 Pinia 設置
setupPinia()
const store = ref(useLotteryStore())
const betTab = computed(() => store.value.betTab)
const clearBet = computed(() => store.value.clearBet)
const LotteryRate = computed(() => store.value.LotteryRate)

const totalNumber = 49
const betData: Ref<{ number: number, active: boolean }[]> = ref([])
const filterOptions = ref<string[]>([])
const filterData = ref(betData.value)

const handleFilter = (value: string) => {
  // Define filter categories
  const sizeFilters = ['big', 'small']
  const parityFilters = ['single', 'double']
  const colorFilters = ['red', 'blue', 'green']
  const zodiacFilters = ['shu', 'niu', 'hu', 'tu', 'long', 'se', 'ma', 'yang', 'hou', 'ji', 'gou', 'zhu']

  // Handle 'all' filter separately
  if (value === 'all') {
    if (filterOptions.value.includes('all')) {
      filterOptions.value = filterOptions.value.filter(item => item !== 'all')
      betData.value.forEach(bet => bet.active = false)
    } else {
      filterOptions.value = ['all']
    }
    return
  }

  // Remove 'all' if any other filter is selected
  filterOptions.value = filterOptions.value.filter(item => item !== 'all')

  // Handle zodiac filters differently (allow multiple selection)
  if (zodiacFilters.includes(value)) {
    if (filterOptions.value.includes(value)) {
      // If clicking the same zodiac filter again, just remove it
      filterOptions.value = filterOptions.value.filter(item => item !== value)
    } else {
      // Add new zodiac filter without removing others
      filterOptions.value.push(value)
    }
    return
  }

  // For non-zodiac filters
  // Find which category the selected filter belongs to
  let category: string[] = []
  if (sizeFilters.includes(value)) category = sizeFilters
  else if (parityFilters.includes(value)) category = parityFilters
  else if (colorFilters.includes(value)) category = colorFilters

  // If clicking the same filter again, just remove it
  if (filterOptions.value.includes(value)) {
    filterOptions.value = filterOptions.value.filter(item => item !== value)
    return
  }

  // Remove other filters from the same category and add the new filter
  if (category.length > 0) {
    // Remove any existing filters from the same category
    filterOptions.value = filterOptions.value.filter(item => !category.includes(item))
    // Add the new filter
    filterOptions.value.push(value)
  }
}

watch(filterOptions, () => {
  // First reset all numbers to inactive
  betData.value.forEach(bet => bet.active = false)

  // If no filters are selected, return early
  if (filterOptions.value.length === 0) {
    return
  }

  // Filter the numbers and set active=true for matches
  filterData.value = betData.value.filter((bet) => {
    if (filterOptions.value.includes('all')) {
      bet.active = true
      return true
    }
    
    let matches = true
    
    // Size filter
    if (filterOptions.value.includes('big')) {
      matches = matches && bet.number > 24
    } else if (filterOptions.value.includes('small')) {
      matches = matches && bet.number <= 24
    }
    
    // Parity filter
    if (filterOptions.value.includes('single')) {
      matches = matches && bet.number % 2 === 1
    } else if (filterOptions.value.includes('double')) {
      matches = matches && bet.number % 2 === 0
    }
    
    // Color filter
    if (filterOptions.value.includes('red')) {
      matches = matches && red.includes(bet.number)
    } else if (filterOptions.value.includes('blue')) {
      matches = matches && blue.includes(bet.number)
    } else if (filterOptions.value.includes('green')) {
      matches = matches && green.includes(bet.number)
    }

    // Zodiac filter with age matching
    const zodiacFilters = ['shu', 'niu', 'hu', 'tu', 'long', 'se', 'ma', 'yang', 'hou', 'ji', 'gou', 'zhu']
    const selectedZodiacFilters = filterOptions.value.filter(option => zodiacFilters.includes(option))
    if (selectedZodiacFilters.length > 0) {
      // 2024年是龍年，計算每個生肖的年齡
      const zodiacAgeMap: { [key: string]: number } = {
        'long': 1,
        'tu': 2,
        'hu': 3,
        'niu': 4,
        'shu': 5,
        'zhu': 6,
        'gou': 7,
        'ji': 8,
        'hou': 9,
        'yang': 10,
        'ma': 11,
        'se': 12
      }

      matches = matches && selectedZodiacFilters.some(zodiac => {
        const age = zodiacAgeMap[zodiac]
        if (age === undefined) return false
        // 將年齡轉換為對應的號碼
        const numbers = []
        for (let i = age + 1; i <= 49; i += 12) {
          numbers.push(i)
        }
        return numbers.includes(bet.number)
      })
    }

    // Set active state based on matches
    if (matches) {
      bet.active = true
    }
    
    return matches
  })
})

const handleBet = (bet: any) => {
  bet.active = !bet.active
}

// Add watch effect for active bets
watch([betData, filterOptions], () => {
  const activeBets = betData.value.filter(bet => bet.active).length
  store.value.setTotalBets(activeBets)
}, { deep: true })

const cleanBetData = () => {
  betData.value = []
  for (let i = 0; i < totalNumber; i++) {
    betData.value.push({
      number: i + 1,
      active: false,
    })
  }
}

const colorFilter = (num: number) => {
  if (red.includes(num)) return 'red-circle'
  if (blue.includes(num)) return 'blue-circle'
  if (green.includes(num)) return 'green-circle'
  return ''
}

const paddingZero = (num: number) => {
  return num.toString().padStart(2, '0')
}

watch(betTab, () => {
  cleanBetData()
  filterOptions.value = []
})

watch(clearBet, (newVal) => {
  if (newVal) {
    cleanBetData()
    filterOptions.value = []
  }
})


onMounted(() => {
  cleanBetData()
})
</script>
<style scoped>
.quick-filter {
  background-color: rgba(247, 126, 4, .1);
}
.quick-filter .filter-item {
  width: 26px;
  height: 24.5px;
  padding: 3px 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #999;
  border-radius: 2px;
  border: 1px solid #999999;
  cursor: pointer;
}
.filter-item.active {
  color: #fff;
  background-color: #f77e04;
  border-color: #f77e04;
}
.number-circle {
  min-width: 36px;
  width: 36px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  border-radius: 50%;
  border: 1px solid #ddd;
  color: #f77e04;
  font-size: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center; 
}
.red-circle {
  color: #d32626;
  position: relative;
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
.refund {
  @apply relative;
  &:after {
    @apply absolute right-[-6px] -top-0 border border-solid border-[#E14138] rounded-[2px] text-[#E14138] text-[10px] w-[13px] h-[13px] flex items-center justify-center font-bold;
    content: "保";
  }
}
</style>