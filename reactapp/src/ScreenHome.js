import React, {useState} from 'react';
import './App.css';
import { connect } from 'react-redux';
import { Input, Button } from 'antd';
import { Redirect } from 'react-router-dom';

function ScreenHome(props) {
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  const [userExists, setUserExists] = useState(false);
  const [errorSignIn, setErrorSignIn] = useState('');
  const [errorSignUp, setErrorSignUp] = useState('');

  var signUp = async () => {
    if(signUpEmail.length === 0 || signUpPassword.length === 0 || signUpUsername.length === 0){
      setErrorSignUp('champ(s) vide(s)');
    } else {
      var response = await fetch('/sign-up', {
        method: 'POST',
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body: `username=${signUpUsername}&email=${signUpEmail}&password=${signUpPassword}`
      });
      const data = await response.json();
      console.log(data);
      if(data.result !== null) {
        setErrorSignUp('all gud m8, registered')
      } else {
        setErrorSignUp('email already registered')
      }
    }
  }


  var signIn = async () => {
    var response = await fetch('/sign-in', {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: `email=${signInEmail}&password=${signInPassword}`
    });
    const data = await response.json()
    if(data.user) {
      setUserExists(true)
      props.addToken(data.user.userToken);
      props.changeLang(data.user.prefLang);
      props.getWishlist(data.user.userWishlist);
      props.addUser(data.user.userName);
      props.addAPI(data.user.APIkey)
    }
    else { setErrorSignIn('email or password invalid')}
    
  }

  if (userExists) { return <Redirect to='/screensource' /> }

  return (
    <div className='Login-page-background'>
      <div className="square2"/> 
      <div className="square1"/>
      <div className="square3"/> 
      <div className="square4"/>
      
      <div className="Login-page" >
      

        {/* SIGN-IN */}
      <div className="Sign">
        <Input 
          className="Login-input"
          placeholder="arthur@lacapsule.com"
          onChange={(e) => setSignInEmail(e.target.value)}
          value={signInEmail}/>

        <Input.Password
          className="Login-input"
          placeholder="password"
          onChange={(e) => setSignInPassword(e.target.value)}
          value={signInPassword}/>
          {errorSignIn}
        <Button type="primary" onClick={() => signIn() }>Sign-in</Button>
      </div>

      {/* SIGN-UP */}
      <div className="Sign">
        <Input
          className="Login-input"
          placeholder="John Doe" 
          onChange={(e) => setSignUpUsername(e.target.value)}
          value={signUpUsername}/>

        <Input
          className="Login-input"
          placeholder="email@email.com" 
          onChange={(e) => setSignUpEmail(e.target.value)}
          value={signUpEmail}/>

        <Input.Password
          className="Login-input"
          placeholder="password"
          onChange={(e) => setSignUpPassword(e.target.value)}
          value={signUpPassword}/>
          {errorSignUp}
        <Button type="primary" onClick={() => signUp() } >Sign-up</Button>
      </div>
    </div>
    </div>
    
  );
}

function mapStateToProps(state){
  return {wishlistDisplay: state.wishlist}
}

function mapDispatchToProps(dispatch){
  return {
    addToken: function(token){
      dispatch({type: 'addToken', tokenAdded: token})
    },
    changeLang: function(lang){
      dispatch({type: lang})
    },
    getWishlist: function(articles){
      dispatch({type: 'getArticles', articles: articles})
    },
    addUser: function(userName){
      dispatch({type: 'addUser', userAdded: userName})
    },
    addAPI: function(API){
      dispatch({type: 'addAPI', APIadded: API})
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScreenHome);