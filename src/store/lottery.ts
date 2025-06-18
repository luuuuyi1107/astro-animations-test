// stores/lottery.ts
import { defineStore } from 'pinia'
import { parseJsonDate, setSessionStorageData } from '@/libs/Common';
import { useApi } from "@/libs/Api";
import { lotteryStatusEnum } from '@/libs/constants';

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
    ServerTime: "",
    OpenLottery: null,
    UserData: null,
    LotteryState: lotteryStatusEnum.COUNTING,
  } as iStoreState),
  actions: {
    setGetPush(data: iGetPush) {
      this.UserData = data.UserData || null;
      this.ServerTime = data.ServerTime || "";
      this.OpenLottery = data.OpenLottery || null;
    },
    setBetAmount(amount: string) {
      this.betAmount = amount;
    },
    setBetTab(tab: string) {
      this.betTab = tab;
    },
    async fetchLotteryDataById(lotteryid: number = 21) {
      const res = await useApi("base").getPush({ lotteryid })
      if (!res.Data) return
      setSessionStorageData(`lottery-${lotteryid}`, { ...res.Data, timestamp: Date.now() });
      this.ServerTime = res.Data.ServerTime || "";
      this.UserData = res.Data.UserData || null;
      this.OpenLottery = res.Data.OpenLottery || null;
    },
    setLotteryState(state: lotteryStatusEnum) {
      this.LotteryState = state;
    }
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
