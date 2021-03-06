import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';

const Home = () => {
  const { authState, oktaAuth } = useOktaAuth();
  const history = useHistory();
  
  let loginViaRedirect = function(){
    let tokenParams = {
      scopes: ['openid', 'email', 'profile'],
    }
    oktaAuth.token.getWithRedirect(tokenParams);
  }

  console.log('authState',authState);
  if (!authState) {
    return <div>Loading...</div>;
  }

  
  let button, name, loginDemoUserCreds;
  
  if(authState.isAuthenticated){
    name = 'Logged In As '+authState.idToken.claims.name;
    button = <button onClick={() => {oktaAuth.signOut()}}>Logout</button>;
    loginDemoUserCreds = '';
  }else{
    name = '';
    button =  <div><button onClick={() => {history.push('/login')}}>Login via Form</button> <button onClick={loginViaRedirect}>Login via Redirect</button></div>;
    loginDemoUserCreds = (<p>Login with:
      Okta User:<br/>
        test@test.com<br/>
        <br/>
      Azure AD Federated User:<br/>
      fred@aad.supersecure.xyz<br/>
        <br/>
        Password:<br/>
        Secret123$</p>);
  }

  return (
    <div>
      <h2>Home</h2>
      <p>{name}</p>
      <p>{button}</p>
      <Link to='/'>Home</Link><br/>
      <Link to='/protected'>Protected</Link> (Requires Login)<br/>
      <br/>
      {loginDemoUserCreds}
      <a target="_top" href="https://glitch.com/edit/#!/remix/reactrouter5-okta-auth-js">
        <img
          src="https://cdn.glitch.com/605e2a51-d45f-4d87-a285-9410ad350515%2FLogo_Color.svg?v=1618199565140"
          alt=""
        />
        Remix This App on Glitch
      </a>
    </div>
  );
};
export default Home;
