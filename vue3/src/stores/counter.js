// stores/counter.js
import { defineStore } from 'pinia'

// 定義一個名為 'counter' 的 store
export const useCounterStore = defineStore('counter', {
  // state 是一個返回初始狀態的函數
  state: () => ({
    count: 0,
    name: '計數器'
  }),
  
  // getters 類似於 computed 屬性
  getters: {
    doubleCount: (state) => state.count * 2,
    // 使用this獲取其他getters
    doubleCountPlusOne() {
      return this.doubleCount + 1
    }
  },
  
  // actions 類似於 methods
  actions: {
    increment() {
      this.count++
    },
    async fetchSomeData() {
      // 支持異步操作
      const data = await api.get('...')
      this.otherValue = data
    }
  }
})