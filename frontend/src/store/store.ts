import { ref, type InjectionKey, type Ref } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'
import createPersistedState from "vuex-persistedstate";

// define your typings for the store state
export interface State {
  isWalletConnected: boolean,
  address: string,
  isChooseToken: boolean,
  tokenIndex: number,
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  plugins: [createPersistedState({
    storage: window.sessionStorage,
})],
  state: {
    isWalletConnected: false,
    address: "",
    isChooseToken: false,
    tokenIndex: 0,
  },
  getters: {
    getIsWalletConnected(state) {
      return state.isWalletConnected;
    },
    getAddress(state) {
      return state.address;
    },
    getIsChooseToken(state) {
      return state.isChooseToken;
    },
    getTokenIndex(state) {
      return state.tokenIndex;
    }
  },
  mutations: {
    setIsWalletConnected(state, value) {
      state.isWalletConnected = value
    },
    setAddress(state, value) {
      state.address = value
    },
    setChooseToken(state, value) {
      state.isChooseToken = value
    },
    setTokenIndex(state, value) {
      state.tokenIndex = value
    }
  },
  actions: {},
  modules: {},
  
})

export function useStore () {
  return baseUseStore(key)
}