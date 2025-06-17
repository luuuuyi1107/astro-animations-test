import { Store } from './store';
import { type State } from './types';

// 定义初始状态
const initialState: State = {
  user: null,
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
};

// 创建 store 实例
const store = new Store({
  state: initialState,
  mutations: {
    SET_USER(state: State, user: any) {
      state.user = user;
    },
  },
  actions: {
    async fetchUser(context: any) {
      // 模拟 API 调用
      const user = await new Promise(resolve => {
        setTimeout(() => {
          resolve({ id: 1, name: 'John Doe' });
        }, 1000);
      });
      context.commit('SET_USER', user);
    },
  },
});

export default store; 