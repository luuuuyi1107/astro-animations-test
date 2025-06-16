import { Store } from './store';
import { State } from './types';

// 定義初始狀態
const initialState: State = {
  user: null,
};

// 創建 store 實例
const store = new Store({
  state: initialState,
  mutations: {
    SET_USER(state: State, user: any) {
      state.user = user;
    },
  },
  actions: {
    async fetchUser(context: any) {
      // 模擬 API 調用
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