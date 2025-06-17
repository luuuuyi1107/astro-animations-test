import { setupPinia } from '@/libs/pinia-setup'
import { useLotteryStore } from '@/store/lottery'

export const useLotteryData = () => {
  setupPinia()
  const store = useLotteryStore()
  return { store }
}