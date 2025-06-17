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
    ServerTime: "",
    OpenLottery: null,
    UserData: null
  } as iStoreState),
  actions: {
    setGetPush(data: iGetPush) {
      this.ServerTime = data.ServerTime || "";
      this.OpenLottery = data.OpenLottery || null;
      this.UserData = data.UserData || null;
    },
    setBetAmount(amount: string) {
      this.betAmount = amount;
    },
    async fetchLotteryDataById(lotteryid: number = 21) {
      const res = await useApi("base").getPush({ lotteryid })
      if (!res.Data) return
      sessionStorage.setItem(`lottery-${lotteryid}`, JSON.stringify({ ...res.Data, timestamp: Date.now() }));
      this.OpenLottery = res.Data.OpenLottery || null;
      this.ServerTime = res.Data.ServerTime || "";
      this.UserData = res.Data.UserData || null;
    },
  },
  getters: {
    timeUntilEnd: (state) => {
      if (!state.OpenLottery?.NewKai || !state.OpenLottery.NewKai.EndTime || !state.ServerTime) {
        return null;
      }
      const serverTime = parseJsonDate(state.ServerTime as string).getTime();
      const endTime = parseJsonDate(state.OpenLottery.NewKai.EndTime).getTime();
      return endTime - serverTime; // 返回剩余时间，单位为毫秒
    },
  }
})
