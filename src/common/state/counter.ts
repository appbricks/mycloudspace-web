import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
    loggedIn: false
  },
  reducers: {
    increment: state => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1
    },
    decrement: state => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
    login: state => {
      console.log('--->login called')
      state.loggedIn = true;
    },
    logout: state => {
      state.loggedIn = false;
    }
  }
})

export const { 
  increment, 
  decrement, 
  incrementByAmount,
  login,
  logout
} = counterSlice.actions

export default counterSlice.reducer