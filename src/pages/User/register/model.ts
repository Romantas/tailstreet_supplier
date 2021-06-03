import type { Effect, Reducer } from 'umi';

import { fakeRegister } from './service';

export type StateType = {
  status?: 'ok' | 'error';
  currentAuthority?: 'user' | 'guest' | 'admin';
  user: Record<string, number | string>;
};

export type ModelType = {
  namespace: string;
  state: StateType;
  effects: {
    submit: Effect;
  };
  reducers: {
    registerHandle: Reducer<StateType>;
  };
};

const Model: ModelType = {
  namespace: 'userAndregister',

  state: {
    status: undefined,
    user: {},
  },

  effects: {
    *submit({ payload }, { call, put }) {
      const response = yield call(fakeRegister, payload);
      yield put({
        type: 'registerHandle',
        payload: response,
      });
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      return {
        ...state,
        status: payload.status,
        user: payload.data,
      };
    },
  },
};

export default Model;
