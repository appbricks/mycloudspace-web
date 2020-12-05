import React, { FunctionComponent } from 'react';
import { Router } from "@reach/router"

import { useAppConfig } from '../common/state/app';
import { PublicRoute, PrivateRoute } from '../common/components/routes';;

const App: FunctionComponent<AppProps> = () => {

  const appConfig = useAppConfig();

  return (
    <Router>
      {appConfig.routes.public.map((route, index) => (
        <PublicRoute
          key={index}
          path={route.uri}
          component={appConfig.routeMap[route.name].feature}
        />
      ))}
      {appConfig.routes.private.map((route, index) => (
        <PrivateRoute
          key={index}
          path={route.uri}
          component={appConfig.routeMap[route.name].feature}
        />
      ))}
    </Router>
  );
}

export default App;

type AppProps = {
}
