import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import '../App.css';
import { List, Avatar, Flex, Tag } from 'antd';
import { StarFilled } from '@ant-design/icons';

import ErrorApiFeedback from '../components/errorapifeedback/ErrorApiFeedback';
import WeatherWidget from '../components/weatherwidget/WeatherWidget';

var API = process.env.REACT_APP_NEWS_API_SECRET

function Flag(props) {
  var styleFlag = 'source-flags'
  if(props.langs === props.langSelected){styleFlag = 'source-flag-selected'}
  return (
    <img
      className={styleFlag}
      alt={props.langs}
      src={`images/flags/${props.langs}.png`}
      onClick={() => props.updateLanguage(props.langs)}
    />
  )
}

function ScreenSource(props) {
  var [sourceList, setSourceList] = useState([])
  var [categories, setCategories] = useState([])
  var [errorAPI, setErrorAPI] = useState(false)
  var [isTransitioning, setIsTransitioning] = useState(false)
  const [selectedTags, setSelectedTags] = React.useState([]);
  const targetRef = useRef(null);
  const headerHeight = 60;

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

        setSourceList(prevSourceList => 
          prevSourceList.filter(source => !props.favorites.some(fav => fav.id === source.id))
        );
        
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
      props.changeLang(changeLang);
      setTimeout(() => { scrollToDiv(); }, 500);
      
    }
  }

  const handleChange = (tag, checked) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);
    setSelectedTags(nextSelectedTags);
  };

  const sourceFavorites = async (type, source) => {
    var method
    if(type === 'add'){
      method = 'POST'
    } else if(type === 'delete') {
      method = 'DELETE'
    }
    var response = await fetch(`/favorites/${type}`, {
      method: method,
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: `token=${props.token}&category=${source.category}&description=${source.description}&id=${source.id}&name=${source.name}&url=${source.url}`
     })
    var data = await response.json();
    if(data.status === 'ok'){
      if(type === 'add'){
        setSourceList(prevSourceList => prevSourceList.filter(item => item.id !== source.id));
        props.addFavorites(source)
      } else if (type === 'delete'){
        setSourceList(prevSourceList => [...prevSourceList, source]);
        props.suprFavorites(source.id)
      }
    } else {
      console.log('problem with backend connection');
    }
  }

  const scrollToDiv = () => {
    const target = targetRef.current;
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }
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
    if(taggedSourceList.length){
      return (
        <div>
          <List
            itemLayout="horizontal"
            dataSource={taggedSourceList}
            renderItem={ source => (
              <List.Item>
                <List.Item.Meta
                  key={i}
                  className='list-item'
                  avatar={<Avatar src={`/images/categories/${source.category}.png`} />}
                  title={
                    <div className='list-item-name' >
                      <Link className='list-link' to={`/screenarticlesbysource/${source.id}`} >
                        {source.name}
                      </Link>
                      <StarFilled className='icon-star' onClick={() => sourceFavorites('add', source) }/>
                    </div>
                  }
                  description={source.description}
                />
              </List.Item>
            )
          }
          />
        </div>
      )
    } else {
      return null;
    }
  })

  var favoritesList
  if(props.favorites.length > 0){
    favoritesList = 
    <div className='list-favorites-container'>
      <h3 className='list-title'>Favorites :</h3>
      <List
        itemLayout="horizontal"
        dataSource={props.favorites}
        renderItem={source => (
          <List.Item>
            <List.Item.Meta
              className='list-item'
              avatar={<Avatar src={`/images/categories/${source.category}.png`} />}
              title={
                <div className='list-item-name' >
                  <Link className='list-link' to={`/screenarticlesbysource/${source.id}`} >
                    {source.name}
                  </Link>
                  <StarFilled className='icon-star-added' onClick={() => sourceFavorites('delete', source) }/>
                </div>
              }
              description={<div className='list-favorites-descr'>{source.description} </div> }
            />
          </List.Item>
        )}
      />
    </div>
  }

  return (
    <div>
      <WeatherWidget />
      <div className="Banner-screensource">
          {flagLang}
      </div>
      {favoritesList}
      <div className={styleSources}>
        {errorAPI
        ? <ErrorApiFeedback/>
        : <div>
            <Flex gap={4} wrap align="center" className='source-tag-container'>
            <h3 ref={targetRef} className='list-title'>Categories :</h3>
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
    favorites: state.favorites
  }
}

function mapDispatchToProps(dispatch){
  return {
    changeLang: function(lang){
      dispatch({type: lang})
    },
    addFavorites: function(source){
      dispatch({type: 'addSource', source: source})
    },
    suprFavorites: function(id){
      dispatch({type: 'suprSource', id: id})
    },
    resetFavorites: function(){
      dispatch({type: 'RESET_FAVORITES'})
    }

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScreenSource)