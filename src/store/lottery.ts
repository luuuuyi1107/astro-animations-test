// stores/lottery.ts
import { defineStore } from 'pinia'
import { parseJsonDate } from '@/libs/Common';
import { useApi } from "@/libs/Api";

// 安全地获取 sessionStorage 数据
const getSessionStorageData = (key: string) => {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    const data = window.sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
  return null;
}

// 安全地设置 sessionStorage 数据
const setSessionStorageData = (key: string, value: any) => {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  }
}

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
    betTab: 'quick',
    lottery: getSessionStorageData("lottery"),
  }),
  actions: {
    setBetAmount(amount: string) {
      this.betAmount = amount;
    },
    setBetTab(tab: string) {
      this.betTab = tab;
      console.log(this.betTab);
    },
    async fetchLotteryDataById(lotteryid: number = 21) {
      const res = await useApi("base").getPush({ lotteryid })
      if (!res.Data) return
      setSessionStorageData("lottery", res.Data);
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


