import React, { useState } from 'react';
import { useOktaAuth } from '@okta/okta-react';



const SignInForm = () => {
  const { oktaAuth } = useOktaAuth();
  const [sessionToken, setSessionToken] = useState();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const loginViaRedirect = (idp) => {
    let tokenParams = {
      idp: idp,
      scopes: ['openid', 'email', 'profile'],
    }
    oktaAuth.token.getWithRedirect(tokenParams);
  }
  
  const loginWithCredentials = (username, password) => {
      oktaAuth.signInWithCredentials({ username, password })
    .then(res => {
      const sessionToken = res.sessionToken;
      setSessionToken(sessionToken);
      // sessionToken is a one-use token, so make sure this is only called once
      oktaAuth.signInWithRedirect({ sessionToken });
    })
    .catch(err => {
      console.log('Found an error', err)
    });
  };
  
  //when login form is submitted, run webfinger first to check if external idp is used
  // if external idp is used, we must redirect
  // if okta is idp then we can validate credentials directly
  const handleSubmit = (event) => {
    event.preventDefault();

    oktaAuth.webfinger({
      resource: 'acct:'+username,
      rel: 'okta:idp'
    })
    .then(function(response) {
      // use the webfinger response to redirect to idp for login if necessary
      console.log(response);

      if(response.links && response.links[0] && response.links[0].rel){
        if(response.links[0].rel === 'okta:idp'){
          loginViaRedirect(response.links[0].properties["okta:idp:id"]);
        }else{
          loginWithCredentials(username, password);
        }
      }else{
        console.error('invalid webfinger response', response);
      }
    })
    .catch(function(err) {
      console.error('webfinger error',err);
    });
    

  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  if (sessionToken) {
    // Hide form while sessionToken is converted into id/access tokens
    return null;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <label>
        Username:
        <input
          id="username" type="text"
          value={username}
          onChange={handleUsernameChange} />
      </label><br/>
      <label>
        Password:
        <input
          id="password" type="password"
          value={password}
          onChange={handlePasswordChange} />
      </label><br/>
      <input id="submit" type="submit" value="Submit" />
    </form>
  );
};
export default SignInForm;