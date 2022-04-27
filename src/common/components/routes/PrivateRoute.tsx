import React, { 
  ElementType, 
  FunctionComponent,
  useEffect
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RouteComponentProps, Redirect } from '@reach/router';
import * as _ from 'lodash';

import { useAppConfig } from '../../state/app';
import Auth, { signoutAction } from '../../state/auth';
import { noopAction } from '../../services';

import Layout from '../layout/Layout';

var signoutTimerID: ReturnType<typeof setTimeout> | undefined = undefined;
const clearTimeoutID = () => {
  if (signoutTimerID) {
    clearTimeout(signoutTimerID);
    signoutTimerID = undefined;
  }
}

const PrivateRoute: FunctionComponent<PrivateRouteProps> = ({ 
  component: Component, 
  componentProps,
  ...other 
}) => {
  if (!Component) 
    throw 'property Component is required for PrivateRoute element';
  
  const appConfig = useAppConfig();

  // retrieve the auth state and allow
  // selector to re-render only if 
  // the logged in state changes
  const auth = useSelector(
    Auth, 
    (left, right) => left.isLoggedIn == right.isLoggedIn
  );

  const dispatch = useDispatch();

  // add event handles to track activity
  // to ensure session does not timeout
  // and at the same time handle timed
  // out sessions
  useEffect(
    () => {
      window.document.addEventListener("click", onDocumentClick)
      window.addEventListener("focus", onWindowFocus);
      window.addEventListener("blur", onWindowBlur);

      return () => {
        window.document.removeEventListener("click", onDocumentClick)
        window.removeEventListener("focus", onWindowFocus);
        window.removeEventListener("blur", onWindowBlur);
        clearTimeoutID();
      };
    },
    [],
  );
  const onDocumentClick = () => {
    // dispatch a noop action to 
    // refresh activity timer
    dispatch(noopAction);
  }
  const onWindowFocus = () => {
    // clear signout timer 
    clearTimeoutID();
    // if session is valid then
    // check if it has timed out
    // due to inactivity by polling
    // the session object 15m from
    // last known session activity
    if (auth.session.isValid()) {

      // sign out if session has timedout
      const checkSessionTimedout = () => {
        if (!auth.user || auth.session.isTimedout(auth.user)) {
          dispatch(signoutAction);
        }
        signoutTimerID = setTimeout(
          checkSessionTimedout, auth.session.timeoutIn(auth.user!));
      }
      checkSessionTimedout();
      // dispatch a noop action to 
      // refresh activity timer
      dispatch(noopAction);

    } else {
      // we should not be here
      dispatch(signoutAction);
    }
  }
  const onWindowBlur = () => {
    // clear signout timer 
    clearTimeoutID();
    // if session is valid then
    // start a timer to time out
    // the user session
    if (auth.session.isValid()) {
      signoutTimerID = setTimeout(
        () => dispatch(signoutAction), auth.session.timeoutIn(auth.user!));      
    } else {
      // we should not be here
      dispatch(signoutAction);
    }
  }
  
  // private routes are allowed only if a valid auth 
  // session exists and it has a logged in status
  if (!auth.session.isValid() || !auth.isLoggedIn) {
    return (
      <Redirect 
        to={appConfig.routeMap['signin'].uri} 
        noThrow 
      />
    );
  }

  return (
    <Layout 
      hideNav
      {...other}
    >
      <Component 
        {...componentProps}
        {...other}
      />
    </Layout>
  );
}

export default PrivateRoute;

type PrivateRouteProps = 
  RouteComponentProps<{
    component: ElementType
    componentProps?: { [props: string]: any } 
  }>
