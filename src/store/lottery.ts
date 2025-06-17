import { parseJsonDate } from '@/libs/Common';
import { Store } from './store';
import { useApi } from "@/libs/Api";

// 定义初始状态
const initialState: iStateGetPush = {
  lottery: sessionStorage.getItem("lottery") ? JSON.parse(sessionStorage.getItem("lottery") || "") : null
};

// 创建 store 实例
const store = new Store({
  state: initialState,
  mutations: {
    SET_LOTTERY(state, payload: { lottery: iGetPush }): void {
      state.lottery = payload.lottery;
    },
    CLEAR_LOTTERY(state): void {
      state.lottery = null;
    }
  },
  actions: {
    async fetchLotteryGetPush(context, data: { id: number }) {
      const res = await useApi("base").getPush({ lotteryid: data.id })
      if (!res.Data) return
      sessionStorage.setItem("lottery", JSON.stringify(res.Data));
      context.commit('SET_LOTTERY', { lottery: res.Data });
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
});

export default store; 