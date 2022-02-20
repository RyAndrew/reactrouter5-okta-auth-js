import React from 'react';
import { Route, useHistory } from 'react-router-dom';
import { Security, SecureRoute, LoginCallback } from '@okta/okta-react';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import Home from './Home';
import SignIn from './SignIn';
import Protected from './Protected';

const AppWithRouterAccess = () => {
  const history = useHistory();
  const onAuthRequired = () => {
    history.push('/login');
  };

  const oktaAuth = new OktaAuth({
    issuer: 'https://supersecuredev.okta.com/oauth2/default',
    clientId: '0oah6bhgvJLRNr56x696',
    redirectUri: 'https://reactrouter5-okta-auth-js.glitch.me/login/callback',
    onAuthRequired: onAuthRequired,
    pkce: true,
    idpDiscovery: true
  });
  
  // onAuthRequired={customAuthHandler}
  //const customAuthHandler = (oktaAuth) => {
  //  // Redirect to the /login page that has a CustomLoginComponent
  //  // This example is specific to React-Router
  //  history.push('/login');
  //};
  
  const restoreOriginalUri = async (_oktaAuth, originalUri) => {
    history.replace(toRelativeUrl(originalUri, window.location.origin));
  };

  return (
    <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
      <Route path='/' exact={true} component={Home} />
      <SecureRoute path='/protected' component={Protected} />
      <Route path='/login' render={() => <SignIn />} />
      <Route path='/login/callback' component={LoginCallback} />
    </Security>
  );
};
export default AppWithRouterAccess;
