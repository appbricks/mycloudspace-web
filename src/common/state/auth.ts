import { RootState } from './store';

// session selector
const Auth = (state: RootState) => state.auth;
export default Auth;

// session selector
export const session = (state: RootState) => state.auth.session;

// isLoggedIn check selector
export const isLoggedIn = (state: RootState) => state.auth.isLoggedIn;

// user selector
export const user = (state: RootState) => state.auth.user;
