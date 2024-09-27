import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './App.css';
import { List, Avatar } from 'antd';
import Nav from './Nav'


function Flag(props) {
  return (
    <img
      style={styles.flags}
      alt={props.lang}
      src={`images/${props.lang}.png`}
      onClick={() => props.updateLanguage(props.lang)}/>
  )
}

function ScreenSource(props) {
  var [sourceList, setSourceList] = useState([])
  var [errorAPI, setErrorAPI] = useState(false)
  var [API, setAPI] = useState('8d52780b5b85441cb744880fdd40412d')

  const languages = {
    fr:{lang: 'fr', coun: 'fr'},
    uk:{lang: 'en', coun: 'gb'},
    us:{lang: 'en', coun: 'us'},
    ge:{lang: 'de', coun: 'de'},
    it:{lang: 'it', coun: 'it'},
    ru:{lang: 'ru', coun: 'ru'}
}

  useEffect( () => {
    const APIResultsLoading = async () => {
      var langSelected = languages[props.lang]
      if(props.APIkey.length !== 0){  
        setAPI(props.APIkey)
      }

      const data = await fetch(`https://newsapi.org/v2/sources?language=${langSelected.lang}&country=${langSelected.coun}&apiKey=${API}`)
      const body = await data.json()
      console.log(body);
      
      if(body.code === 'rateLimited'){
        setErrorAPI(true)
      } else if(body.code === 'apiKeyInvalid'){
        console.log(API);
        
        setErrorAPI(true)
      } else {
        setErrorAPI(false);
        setSourceList(body.sources);
      }
    }
    APIResultsLoading()
  },[props.lang, API])


  var updateLanguage = async (changeLang) => {
    setErrorAPI(false)
    var response = await fetch('/update-lang', {
      method: 'PUT',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: `token=${props.token}&lang=${changeLang}`
     })
    var data = await response.json();
    if(data){
      props.changeLang(changeLang)
    }
  }

  var errorApiScreen = (
  <div>
    <p>ERROR API. Number of limit requests reached or API key is invalid.</p>
    <p>Go to <Link to={`/user/${props.username}`}>user settings</Link> and add/modify your personnal free API</p>
    <p>Register for free <Link to={{pathname: "https://newsapi.org/register"}} target="_blank">here</Link></p>
  </div>)
  

  var flagLang = Object.keys(languages).map((flag, i)=> {
    return (<Flag key={i} lang={flag} updateLanguage={(e) => updateLanguage(e)} ></Flag>)
  })


  return (
    <div>
      <Nav />
      <div className="Banner">
          {flagLang}
      </div>
      <div className="HomeThemes">
        {errorAPI
        ? errorApiScreen
        : <List
          itemLayout="horizontal"
          dataSource={sourceList}
          renderItem={source => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={`/images/${source.category}.png`} />}
                title={<Link to={`/screenarticlesbysource/${source.id}`}>{source.name}</Link>}
                description={source.description}
              />
            </List.Item>
          )}
        />
        }
      </div>
    </div>
  );
}


function mapStateToProps(state) { 
  return {
    lang: state.language,
    token: state.userToken,
    username: state.userName,
    APIkey: state.apiKey,
  }
}

function mapDispatchToProps(dispatch){
  return {
    changeLang: function(lang){
      dispatch({type: lang})
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScreenSource)

const styles = {
  flags: {
    width: 50, opacity: 1, margin: 10, cursor: 'pointer'
  }
}
