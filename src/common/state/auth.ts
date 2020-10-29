import { RootState } from './store';
import { login, logout } from './counter';

// isLoggedIn check selector
export const isLoggedIn = (state: RootState) => state.counter.loggedIn;

// user selector
export const user = (state: RootState) => state.counter.user;

// login action
export { login, logout };