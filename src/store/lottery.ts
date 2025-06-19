// stores/lottery.ts
import { defineStore } from 'pinia'
import { parseJsonDate, setSessionStorageData } from '@/libs/Common';
import { useApi } from "@/libs/Api";
import { lotteryStatusEnum } from '@/libs/constants';
import { GetPushKeysEnum } from '@/libs/constants';

export const useLotteryStore = defineStore('lottery', {
  state: () => ({
    betAmount: '',
    totalBets: 0,
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
    clearBet: false,
    ServerTime: "",
    OpenLottery: null,
    UserData: null,
    LotteryState: lotteryStatusEnum.END,
    LotteryRate: null,
    currentGame: {} as iGameDataTransObject
  } as iStoreState),
  actions: {
    setGetPush(data: iGetPush) {
      this.UserData = data.UserData || null;
      this.ServerTime = data.ServerTime || "";
      this.OpenLottery = data.OpenLottery || null;
      this.LotteryRate = data.LotteryRate || null;
    },
    setServerTime(time: string) {
      this.ServerTime = time;
    },
    setBetAmount(amount: string) {
      this.betAmount = amount;
    },
    setTotalBets(totalBets: number) {
      this.totalBets = totalBets;
    },
    setBetTab(tab: string) {
      this.betTab = tab;
      this.betAmount = '0';
      this.totalBets = 0;
    },
    setClearBet(clearBet: boolean) {
      if (clearBet) {
        this.clearBet = clearBet;
        this.betAmount = '0';
        this.totalBets = 0;
      }
      setTimeout(() => {
        this.clearBet = false;  
      }, 300);

    },
    setCurrentGame(game: iGameDataTransObject) {
      this.currentGame = game;
    },
    async fetchLotteryDataById(lotteryid: number = 21) {
      const res = await useApi("base").getPush({ 
        lotteryid, 
        keys: [GetPushKeysEnum.LOTTERY_RATE, GetPushKeysEnum.SIXSET] 
      })
      if (!res.Data) return
      setSessionStorageData(`lottery-${lotteryid}`, { ...res.Data, timestamp: Date.now() });
      this.ServerTime = res.Data.ServerTime || "";
      this.UserData = res.Data.UserData || null;
      this.OpenLottery = res.Data.OpenLottery || null;
      this.LotteryRate = res.Data.LotteryRate || null;
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
    differTime: (state) => {
      if (!state.ServerTime) {
        return 0;
      }
      const serverTime = parseJsonDate(state.ServerTime as string).getTime();
      const currentTime = Date.now();
      return currentTime - serverTime; // 返回本地时间和伺服器时间的差异(毫秒)
    }
  }
})
