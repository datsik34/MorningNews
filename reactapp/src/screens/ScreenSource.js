import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import '../App.css';
import { List, Avatar, Flex, Tag } from 'antd';

import WeatherWidget from '../components/weatherwidget/WeatherWidget';

var API = process.env.REACT_APP_NEWS_API_SECRET

function Flag(props) {
  var styleFlag = styles.flags
  if(props.langs === props.langSelected){styleFlag = styles.flagSelected}
  return (
    <img
      style={styleFlag}
      alt={props.langs}
      src={`images/flags/${props.langs}.png`}
      onClick={() => props.updateLanguage(props.langs)}
    />
  )
}

function ErrorApiScreen(props) {
  return (
    <div className='errordiv'>
      <h1>Woops !</h1>
      <img src='images/disconnected.png' className='errorimg'/>
      <p>ERROR API. Number of limit requests reached or API key is invalid.</p>
      <p>Go to <Link to={`/user/${props.username}`}>user settings</Link> and add/modify your personnal free API</p>
      <p>Register for free <Link to={{pathname: "https://newsapi.org/register"}} target="_blank">here</Link></p>
    </div>
  )
}

function ScreenSource(props) {
  var [sourceList, setSourceList] = useState([])
  var [categories, setCategories] = useState([])
  var [errorAPI, setErrorAPI] = useState(false)
  var [isTransitioning, setIsTransitioning] = useState(false)
  const [selectedTags, setSelectedTags] = React.useState([]);

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
        API = props.APIkey
      } else {
        API = process.env.REACT_APP_API_SECRET
      }
      const response = await fetch(`https://newsapi.org/v2/sources?language=${langSelected.lang}&country=${langSelected.coun}&apiKey=${API}`)
      const data = await response.json()
      if(data.code === 'rateLimited' || data.code === 'apiKeyInvalid'){
        setErrorAPI(true)
      } else {
        setErrorAPI(false);
        setIsTransitioning(false);
        setSourceList(data.sources);
        
        let getCategories
        getCategories = data.sources.map((item) => { return item.category }) 
        let uniqueCategories = [...new Set(getCategories)];

        setCategories(uniqueCategories)
        setSelectedTags(uniqueCategories)
      }
    }
    APIResultsLoading()
  },[props.lang, API])


  var updateLanguage = async (changeLang) => {
    setErrorAPI(false);
    setIsTransitioning(true);
    var response = await fetch('/user-settings/update-lang', {
      method: 'PUT',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: `token=${props.token}&lang=${changeLang}`
     })
    var data = await response.json();
    if(data){
      props.changeLang(changeLang)
    }
  }

  const handleChange = (tag, checked) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);
    setSelectedTags(nextSelectedTags);
  };

  var flagLang = Object.keys(languages).map((flag, i)=> {
    return (<Flag key={i} langs={flag} langSelected={props.lang} updateLanguage={(e) => updateLanguage(e)} ></Flag>)
  })

  var styleSources = "HomeThemes"
  if(isTransitioning && !errorAPI){
    styleSources = "HomeThemesAnim"
  } else {
    styleSources = "HomeThemes"
  }
  
  var filteredTagList = []
  selectedTags.map((tag) => {
    var list = sourceList.filter(source => source.category === tag)
    filteredTagList.push(list)
  })

  var filteredList =  filteredTagList.map((taggedSourceList, i) => {
    return (
      <div>
        <List
          key={i}
          itemLayout="horizontal"
          dataSource={taggedSourceList}
          renderItem={source => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={`/images/categories/${source.category}.png`} />}
                title={<Link to={`/screenarticlesbysource/${source.id}`} >{source.name}</Link>}
                description={source.description}
              />
            </List.Item>
          )}
        />
      </div>
    )
  })

  return (
    <div>
      <WeatherWidget />
      <div className="Banner-screensource">
          {flagLang}
      </div>
      <div className={styleSources}>
        {errorAPI
        ? <ErrorApiScreen/>
        : <div>
            <Flex gap={4} wrap align="center" style={{marginBottom: 20}}>
              <span>Categories:</span>
              {categories.map((tag) => (
                <Tag.CheckableTag
                  key={tag}
                  checked={selectedTags.includes(tag)}
                  onChange={(checked) => handleChange(tag, checked)}
                >
                  {tag}
                </Tag.CheckableTag>
              ))}
            </Flex>
            {filteredList}
          </div>
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
  },
  flagSelected: {
    width: 50, opacity: 1, margin: 10, cursor: 'pointer',
    border: 'solid 3px', borderRadius: '50%', borderColor: 'green'
  },
  weatherWidget: {
    right: 20,
    top: 80,
    position: 'fixed'
  }
}
