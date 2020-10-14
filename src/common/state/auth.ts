import { RootState } from './store';
import { login, logout } from './counter';

// isLoggedIn check selector
export const isLoggedIn = (state: RootState) => state.counter.loggedIn;

// login action
export { login, logout };