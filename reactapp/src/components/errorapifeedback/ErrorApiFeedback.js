import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import '../../App.css';

function ErrorApiFeedback(props) {
    return (
      <div className='errordiv'>
        <h1>Woops !</h1>
        <img src={`${process.env.PUBLIC_URL}/images/disconnected.png`} className='errorimg'/>
        <p>ERROR API. Number of limit requests reached or API key is invalid.</p>
        <p>Go to <Link to={`/user/${props.username}`}>user settings</Link> and add/modify your personnal free API</p>
        <p>Register for free <Link to={{pathname: "https://newsapi.org/register"}} target="_blank">here</Link></p>
      </div>
    )
  }

function mapStateToProps(state) { 
    return {
        username: state.userName
    }
}

export default connect(mapStateToProps, null)(ErrorApiFeedback)