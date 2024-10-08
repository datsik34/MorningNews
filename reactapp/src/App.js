import './App.css';
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';

//Reducers
import wishList from './reducers/articles';
import userToken from './reducers/token';
import language from './reducers/language';
import userName from './reducers/username';
import email from './reducers/email';
import apiKey from './reducers/apikey';

//Screens
import ScreenHome from './screens/ScreenHome';
import ScreenArticlesBySource from './screens/ScreenArticlesBySource';
import ScreenMyArticles from './screens/ScreenMyArticles';
import ScreenSource from './screens/ScreenSource';
import ScreenUser from './screens/ScreenUser';
import ScreenLogout from './screens/ScreenLogout';

const store = createStore(combineReducers({
  wishList, userToken, language, userName, email, apiKey
}));

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route component={ScreenHome} path="/" exact />
          <Route component={ScreenSource} path="/screensource" exact />
          <Route component={ScreenArticlesBySource} path="/screenarticlesbysource/:id" exact />
          <Route component={ScreenMyArticles} path="/screenmyarticles" exact />
          <Route component={ScreenUser} path="/user/:username" exact />
          <Route component={ScreenLogout} path="/logout" exact />
        </Switch>
      </Router>
    </Provider>
  );
}