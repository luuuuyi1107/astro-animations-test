export type State = {
  [key: string]: any;
};

export type Action = {
  type: string;
  payload?: any;
};

export type Mutation = {
  type: string;
  payload?: any;
};

export type StoreOptions = {
  state: State;
  mutations?: {
    [key: string]: (state: State, payload?: any) => void;
  };
  actions?: {
    [key: string]: (context: StoreContext, payload?: any) => void;
  };
};

export type StoreContext = {
  state: State;
  commit: (type: string, payload?: any) => void;
  dispatch: (type: string, payload?: any) => void;
}; 