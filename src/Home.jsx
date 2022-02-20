import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';

const Home = () => {
  const { authState, oktaAuth } = useOktaAuth();
  const history = useHistory();
  
  let loginViaRedirect = function(){
    let tokenParams = {
      scopes: ['openid', 'email', 'profile'], //, 'https://graph.microsoft.com/User.Read'
    }
    oktaAuth.token.getWithRedirect(tokenParams);
  }

  console.log('authState',authState);
  if (!authState) {
    return <div>Loading...</div>;
  }

  
  let button, name;
  
  if(authState.isAuthenticated){
    name = 'Logged In As '+authState.idToken.claims.name;
    button = <button onClick={() => {oktaAuth.signOut()}}>Logout</button>;
  }else{
    name = '';
    button =  <div><button onClick={() => {history.push('/login')}}>Login via Form</button> <button onClick={loginViaRedirect}>Login via Redirect</button></div>;
  }

  return (
    <div>
      <p>{name}</p>
      <p>{button}</p>
      <Link to='/'>Home</Link><br/>
      <Link to='/protected'>Protected</Link><br/>
    </div>
  );
};
export default Home;
