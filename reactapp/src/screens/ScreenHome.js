import React, {useState} from 'react';
import '../App.css';
import { connect } from 'react-redux';
import { Input, Button, Form } from 'antd';
import { Redirect } from 'react-router-dom';

function ScreenHome(props) {
  const [userExists, setUserExists] = useState(false);
  const [messageSignIn, setMessageSignIn] = useState('');
  const [messageSignUp, setMessageSignUp] = useState('');
  const [errorSignUp, setErrorSignUp] = useState(false);
  const [errorSignIn, setErrorSignIn] = useState(false);

  const [formSignIn] = Form.useForm();
  const [formSignUp] = Form.useForm();

  var signUp = async (values) => {
    formSignUp.resetFields();
    var response = await fetch('/sign-up', {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: `username=${values.username}&email=${values.email}&password=${values.password}`
    });
    const data = await response.json();
    if(data.result !== null) {
      setMessageSignUp('all good, account registered')
    } else {
      setMessageSignUp('email already registered')
      onFinishFailed('signup')
    }
  }

  var signIn = async (values) => {
    formSignIn.resetFields();
    var response = await fetch('/sign-in', {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: `email=${values.email}&password=${values.password}`
    });
    const data = await response.json()
    if(data.user) {
      props.addToken(data.user.userToken);
      props.changeLang(data.user.prefLang);
      props.getWishlist(data.user.userWishlist);
      props.getFavorites(data.user.userFavorites);
      props.addUsername(data.user.userName);
      props.addEmail(data.user.email);
      props.addAPI(data.user.APIkey);
      setUserExists(true)
    }
    else { 
      setMessageSignIn('email or password invalid')
      onFinishFailed('signin')
    }
  }

  var onFinishFailed = (e) => {
    if(e === 'signin'){
      setErrorSignIn(true)
      setTimeout(() => {
        setErrorSignIn(false);
      }, 200);
    } else if (e === 'signup'){
      setErrorSignUp(true)
      setTimeout(() => {
        setErrorSignUp(false);
      }, 200);
    }
  }

  if (userExists) { return <Redirect to='/screensource' /> }

  var messageStyle = 'sign-message-error';
  if(messageSignUp[0] === 'a'){
    messageStyle = 'sign-message-success'
  } else { messageStyle = 'sign-message-error'}

  return (
    <div className='Login-page-background'>
      <div className="square2"/> 
      <div className="square1"/>
      <div className="square3"/> 
      <div className="square4"/>
      
      <div className="Login-page" >

        {/* SIGN-IN */}
          <Form
            form={formSignIn}
            name="signin"
            initialValues={{ remember: true }}
            onFinish={signIn}
            className={`Sign ${errorSignIn ? 'errorAnimation' : ''}`}
            onFinishFailed={() => onFinishFailed('signin')}
          >
            <Form.Item
              name="email"
              className="Login-input"
              rules={[ { type:'email', required: true, message: 'Please input your email!' } ]}
            >
              <Input placeholder="arthur@lacapsule.com" autoComplete='current-email'/>
            </Form.Item>
            <Form.Item
              name="password"
              className="Login-input"
              rules={[ { required: true, message: 'Please input your password!'} ]}
            >
              <Input.Password placeholder="password" autoComplete='current-password'/>
            </Form.Item>
            <p className='sign-message-error'>{messageSignIn}</p>
            <Form.Item className='signin-form-button'>
              <Button type="primary" htmlType="submit" className='testbutton'> Sign-in </Button>
            </Form.Item>
          </Form>

        {/* SIGN-UP */}
          <Form
            form={formSignUp}
            name="signup"
            initialValues={{ remember: true }}
            onFinish={signUp}
            onFinishFailed={() => onFinishFailed('signup')}
            className={`Sign ${errorSignUp ? 'errorAnimation' : ''}`}
          >
            <Form.Item
              name="username"
              className="Login-input"
              rules={[ { required: true, message: 'Please input your username!' }, {min: 3} ]}
            >
              <Input placeholder="John Doe" autoComplete='current-username'/>
            </Form.Item>
            <Form.Item
              name="email"
              className="Login-input"
              rules={[ { type:'email', required: true, message: 'Please input your email!' } ]}
            >
              <Input placeholder="email@email.com" autoComplete='current-email'/>
            </Form.Item>
            <Form.Item
              name="password"
              className="Login-input"
              rules={[ { required: true, message: 'Please input your password!'}, {min: 8} ]}
            >
              <Input.Password placeholder="password" autoComplete='current-password'/>
            </Form.Item>
            <p className={messageStyle}>{messageSignUp}</p>
            <Form.Item className='sign-form-button'>
              <Button type="primary" htmlType="submit"> Sign-up </Button>
            </Form.Item>
          </Form>
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
    addUsername: function(userName){
      dispatch({type: 'addUsername', usernameAdded: userName})
    },
    addEmail: function(email){
      dispatch({type: 'addEmail', emailAdded: email})
    },
    addAPI: function(API){
      dispatch({type: 'addAPI', APIadded: API})
    },
    getFavorites: function(favorites){
      dispatch({type: 'getFavorites', favorites: favorites})
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScreenHome);