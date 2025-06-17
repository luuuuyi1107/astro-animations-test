// stores/lottery.ts
import { defineStore } from 'pinia'

export const useLotteryStore = defineStore('lottery', {
  state: () => ({
    betAmount: '',
    betAmountList: [
      {
        amount: 10,
      },
      {
        amount: 100,
      },
      {
        amount: 1000,
      },
      {
        amount: 5000,
      },
    ],
  }),
  actions: {
    setBetAmount(amount: string) {
      this.betAmount = amount;
    },
  },
})
