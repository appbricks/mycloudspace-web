import { RootState } from './store';

import { SIGN_OUT_REQ } from '@appbricks/identity';
import { createAction } from '@appbricks/utils';

// auth selector
const Auth = (state: RootState) => state.auth;
export default Auth;

// session selector
export const session = (state: RootState) => state.auth.session;

// isLoggedIn check selector
export const isLoggedIn = (state: RootState) => state.auth.isLoggedIn;

// user selector
export const user = (state: RootState) => state.auth.user;

// signout action
export const signoutAction = createAction(SIGN_OUT_REQ);