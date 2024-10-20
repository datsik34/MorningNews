const mongoose = require('mongoose');

var articleSchema = mongoose.Schema({
  title: String,
  description: String,
  urlToImage: String,
  content: String,
  url: String
})
var sourceSchema = mongoose.Schema({
  category: String,
  description: String,
  id: String,
  name: String,
  url: String,
  country: String
})

var userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    token: String,
    prefLang: String,
    wishlist: [articleSchema],
    favorites: [sourceSchema],
    APIkey: String,
    dateSettingsChanged:{
      username: Date,
      email: Date,
      password: Date
    },
    WeatherWidget:{
      currentCity: String,
      cityChanged: Date
    }
  });

var userModel = mongoose.model('users', userSchema);

module.exports = userModel;