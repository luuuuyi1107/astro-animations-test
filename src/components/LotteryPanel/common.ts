import { lotteryStatusEnum } from '@/libs/constants'
import { setupPinia } from '@/libs/pinia-setup'
import { useLotteryStore } from '@/store/lottery'
import { ref } from 'vue'
type StateChangeCallback = (state: lotteryStatusEnum) => void
type LotteryDataChangeCallback = (data: iOpenLottery) => void
let initialPiniaSetup = false
export const useLotteryData = (cachedData?: iGetPush) => {
  if (!initialPiniaSetup) {
    initialPiniaSetup = true
    setupPinia()
  }

  const previousLotteryState = ref(lotteryStatusEnum.COUNTING)
  const previousServerTime = ref("")
  const store = useLotteryStore()
  if (cachedData) store.setGetPush(cachedData)
  // 储存回调函数
  const stateChangeCallbacks: StateChangeCallback[] = []
  const lotteryDataChangeCallbacks: LotteryDataChangeCallback[] = []

  store.$subscribe(() => {
    if (store.ServerTime !== previousServerTime.value) {
      previousServerTime.value = store.ServerTime
      // 触发所有数据变化回调函数
      lotteryDataChangeCallbacks.forEach(callback => {
        callback(store.OpenLottery as iOpenLottery)
      })
    }

    if (previousLotteryState.value !== store.LotteryState) {
      previousLotteryState.value = store.LotteryState as lotteryStatusEnum
      // 触发所有回调函数
      stateChangeCallbacks.forEach(callback => {
        callback(store.LotteryState as lotteryStatusEnum)
      })
    }
  })

  // 注册状态变化回调
  const onStateChange = (callback: StateChangeCallback): (() => void) => {
    stateChangeCallbacks.push(callback)
    
    // 返回取消注册的函数
    return () => {
      const index = stateChangeCallbacks.indexOf(callback)
      if (index > -1) {
        stateChangeCallbacks.splice(index, 1)
      }
    }
  }

  const onLotteryDataChange = (callback: LotteryDataChangeCallback): (() => void) => {
    lotteryDataChangeCallbacks.push(callback)
    return () => {
      const index = lotteryDataChangeCallbacks.indexOf(callback)
      if (index > -1) {
        lotteryDataChangeCallbacks.splice(index, 1) 
      }
    }
  }

  return { store, onStateChange, onLotteryDataChange }
}