import { RootState } from './store';
import { signin, signout } from './counter';

// isLoggedIn check selector
export const isLoggedIn = (state: RootState) => state.counter.loggedIn;

// user selector
export const user = (state: RootState) => state.counter.user;

// signin/signout actions
export { signin, signout };