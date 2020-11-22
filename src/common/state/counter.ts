import { createSlice } from '@reduxjs/toolkit';

import { persistReducer } from 'redux-persist'
import sessionStorage from 'redux-persist/lib/storage/session'

import { User } from '@appbricks/identity';

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
    loggedIn: false,
    user: undefined
  } as CounterState,
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
    signin: state => {
      state.loggedIn = true;

      const user = new User();
      user.firstName = 'Mevan';
      user.middleName = 'K';
      user.familyName = 'Samaratunga';
      user.emailAddress = 'mevansam@gmail.com';
      user.mobilePhone = '+19786526615';
      state.user = user;      
    },
    signout: state => {
      state.loggedIn = false;
      state.user = undefined;
    }
  }
})

export const { 
  increment, 
  decrement, 
  incrementByAmount,
  signin,
  signout
} = counterSlice.actions;

export default persistReducer(
  {
    key: 'counter',
    storage: sessionStorage,
    blacklist: []
  }, 
  counterSlice.reducer
);

type CounterState = {
  value: number
  loggedIn: boolean
  user?: User
}
