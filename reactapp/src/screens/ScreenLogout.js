import React from 'react';
import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const ScreenLogout = (props) => {
    props.resetToken();
    props.resetLang();
    props.resetWishlist();
    props.resetUsername();
    props.resetEmail();
    props.resetAPI();
    
    return (
        <div style={styles}>
            <Result
                status="success"
                title="Successfully disconnected"
                extra={
                    <Link to={"/"}>
                        <Button type="primary" key="console">
                            Go to SignIn/SignUp
                        </Button>
                    </Link>
                }
            />
        </div>
    )
}
const styles = {display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh'}

function mapDispatchToProps(dispatch){
    return {
      resetToken: function(){
        dispatch({type: 'RESET'})
      },
      resetLang: function(){
        dispatch({type: 'RESET'})
      },
      resetWishlist: function(){
        dispatch({type: 'RESET'})
      },
      resetUsername: function(){
        dispatch({type: 'RESET'})
      },
      resetEmail: function(){
        dispatch({type: 'RESET'})
      },
      resetAPI: function(){
        dispatch({type: 'RESET'})
      }
    }
  }

export default connect( null, mapDispatchToProps)(ScreenLogout);