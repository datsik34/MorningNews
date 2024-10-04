import React, {useState} from 'react';
import './App.css';
import { connect } from 'react-redux';
import { Input, Button, Form } from 'antd';
import { Redirect } from 'react-router-dom';

function ScreenHome(props) {
  const [userExists, setUserExists] = useState(false);
  const [errorSignIn, setErrorSignIn] = useState('');
  const [errorSignUp, setErrorSignUp] = useState('');

  const [formSignIn] = Form.useForm();
  const [formSignUp] = Form.useForm();

  const onFinish = (values) => {
    console.log('Success:', values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  var signUp = async (values) => {
    formSignUp.resetFields();
    var response = await fetch('/sign-up', {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: `username=${values.username}&email=${values.email}&password=${values.password}`
    });
    const data = await response.json();
    if(data.result !== null) {
      setErrorSignUp('all gud m8, registered')
    } else {
      setErrorSignUp('email already registered')
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
      setUserExists(true)
      props.addToken(data.user.userToken);
      props.changeLang(data.user.prefLang);
      props.getWishlist(data.user.userWishlist);
      props.addUsername(data.user.userName);
      props.addEmail(data.user.email);
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
          <Form
            form={formSignIn}
            name="signin"
            initialValues={{ remember: true }}
            onFinish={signIn}
            onFinishFailed={onFinishFailed}
            className="Sign"
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
            <p style={styles.errorMessage}>{errorSignIn}</p>
            <Form.Item style={{marginBottom: 13}}>
              <Button type="primary" htmlType="submit"  > Sign-in </Button>
            </Form.Item>
          </Form>

        {/* SIGN-UP */}
          <Form
            form={formSignUp}
            name="signup"
            initialValues={{ remember: true }}
            onFinish={signUp}
            onFinishFailed={onFinishFailed}
            className="Sign"
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
            <p style={styles.errorMessage}>{errorSignUp}</p>
            <Form.Item style={{marginBottom: 13}}>
              <Button type="primary" htmlType="submit"> Sign-in </Button>
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
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScreenHome);

const styles = {
  errorMessage: {
    margin: 0,
    padding: 10,
    color: '#EA5354'
    }
}