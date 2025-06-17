// stores/lottery.ts
import { defineStore } from 'pinia'
import { parseJsonDate } from '@/libs/Common';
import { useApi } from "@/libs/Api";

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
    lottery: sessionStorage.getItem("lottery") ? JSON.parse(sessionStorage.getItem("lottery") || "") : null, // 这里可以根据实际类型定义
  }),
  actions: {
    setBetAmount(amount: string) {
      this.betAmount = amount;
    },
    async fetchLotteryDataById(lotteryid: number = 21) {
      const res = await useApi("base").getPush({ lotteryid })
      if (!res.Data) return
      sessionStorage.setItem("lottery", JSON.stringify(res.Data));
      this.lottery = res.Data;
    },
  },
  getters: {
    timeUntilEnd: (state) => {
      if (!state.lottery || !state.lottery.OpenLottery?.NewKai || !state.lottery.OpenLottery.NewKai.EndTime) {
        return null;
      }
      const serverTime = parseJsonDate(state.lottery.ServerTime).getTime();
      const endTime = parseJsonDate(state.lottery.OpenLottery.NewKai.EndTime).getTime();
      return endTime - serverTime; // 返回剩余时间，单位为毫秒
    },
  }
})


