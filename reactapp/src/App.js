import './App.css';
import React from 'react';
import { BrowserRouter as Router, Switch, Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';

//Reducers
import wishList from './reducers/articles';
import favorites from './reducers/favorites';
import userToken from './reducers/token';
import language from './reducers/language';
import userName from './reducers/username';
import email from './reducers/email';
import apiKey from './reducers/apikey';
import weatherCurrent from './reducers/weatherwidget/weathercurrent';
import weatherForecast from './reducers/weatherwidget/weatherforecast';

//Screens
import ScreenHome from './screens/ScreenHome';
import ScreenArticlesBySource from './screens/ScreenArticlesBySource';
import ScreenMyArticles from './screens/ScreenMyArticles';
import ScreenSource from './screens/ScreenSource';
import ScreenUser from './screens/ScreenUser';
import ScreenLogout from './screens/ScreenLogout';

//Components
import Header from './components/header/Header';
import RadioWidget from './components/radiowidget/RadioWidget';


const store = createStore(combineReducers({
  wishList, favorites, userToken, language, userName, email, apiKey, weatherCurrent, weatherForecast
}));


// Create a new component to handle routing and useLocation
function AppContent() {
  const location = useLocation();
  const hideHeaderRoutes = ['/', '/logout'];

  return (
    <>
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}
      {!hideHeaderRoutes.includes(location.pathname) && <RadioWidget />}
      <Switch>
        <Route component={ScreenHome} path="/" exact />
        <Route component={ScreenSource} path="/screensource" exact />
        <Route component={ScreenArticlesBySource} path="/screenarticlesbysource/:id" exact />
        <Route component={ScreenMyArticles} path="/screenmyarticles" exact />
        <Route component={ScreenUser} path="/user/:username" exact />
        <Route component={ScreenLogout} path="/logout" exact />
      </Switch>
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}