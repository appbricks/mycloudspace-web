import { RootState } from './store';

// isLoggedIn check selector
export const isLoggedIn = (state: RootState) => state.auth.isLoggedIn;

// user selector
export const user = (state: RootState) => state.auth.user;
