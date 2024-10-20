import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const ScreenLogout = (props) => {
    props.resetToken();
    props.resetLang();
    props.resetWishlist();
    props.resetUsername();
    props.resetEmail();
    props.resetAPI();
    props.resetCurrentWeather();
    props.resetForecast();

    return (
        <div className='logout-container'>
          <div className='logout-column'>
            <img src='images/logout.svg' className='logout-img'/>
            <p>Successfully logged out</p>
            <Link to={"/"}>
              <Button type="primary" key="console">
                  Go to SignIn/SignUp
              </Button>
            </Link>
          </div>
        </div>
    )
}

function mapDispatchToProps(dispatch){
    return {
      resetToken: function(){
        dispatch({type: 'RESET_TOKEN'})
      },
      resetLang: function(){
        dispatch({type: 'RESET_LANG'})
      },
      resetWishlist: function(){
        dispatch({type: 'RESET_ARTICLES'})
      },
      resetUsername: function(){
        dispatch({type: 'RESET_USERNAME'})
      },
      resetEmail: function(){
        dispatch({type: 'RESET_EMAIL'})
      },
      resetAPI: function(){
        dispatch({type: 'RESET_WEATHER_API'})
      },
      resetCurrentWeather: function(){
        dispatch({type: 'RESET_CURRENTS'})
      },
      resetForecast: function(){
        dispatch({type: 'RESET_FORECAST'})
      }
    }
  }

export default connect( null, mapDispatchToProps)(ScreenLogout);