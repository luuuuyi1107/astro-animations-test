import type { State, StoreOptions, StoreContext } from './types';

export class Store {
  private state: State;
  private mutations: { [key: string]: (state: State, payload?: any) => void };
  private actions: { [key: string]: (context: StoreContext, payload?: any) => void };
  private subscribers: ((state: State) => void)[] = [];
  private getters: { [key: string]: (state: State) => any };
  private getterProxy: any;
  

  constructor(options: StoreOptions) {
    // 尝试从 localStorage 恢复状态
    const savedState = typeof window !== 'undefined' ? localStorage.getItem('store-state') : null;
    this.state = savedState ? JSON.parse(savedState) : options.state;
    this.mutations = options.mutations || {};
    this.actions = options.actions || {};
    this.getters = options.getters || {};
    this.setupGetterProxy()
  }

  private setupGetterProxy(): void {
    this.getterProxy = new Proxy({}, {
      get: (_, key: string) => {
        const getter = this.getters[key];
        if (!getter) {
          console.warn(`Getter "${key}" not found`);
          return undefined;
        }
        return getter(this.state);
      }
    });
  }

  getState(): State {
    return this.state;
  }

  commit(type: string, payload?: any): void {
    const mutation = this.mutations[type];
    if (!mutation) {
      console.warn(`Mutation "${type}" not found`);
      return;
    }
    mutation(this.state, payload);
    this.notify();
    
    // 保存状态到 localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('store-state', JSON.stringify(this.state));
    }
  }

  dispatch(type: string, payload?: any): void {
    const action = this.actions[type];
    if (!action) {
      console.warn(`Action "${type}" not found`);
      return;
    }
    const context: StoreContext = {
      state: this.state,
      commit: this.commit.bind(this),
      dispatch: this.dispatch.bind(this),
    };
    action(context, payload);
  }

  subscribe(callback: (state: State) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  get getter(): any {
    return this.getterProxy;
  }

  private notify(): void {
    this.subscribers.forEach(callback => callback(this.state));
  }

 
} 