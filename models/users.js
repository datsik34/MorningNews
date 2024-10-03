const mongoose = require('mongoose');

var articleSchema = mongoose.Schema({
  title: String,
  description: String,
  urlToImage: String,
  content: String,
  url: String
})

var userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    token: String,
    prefLang: String,
    wishlist: [articleSchema],
    APIkey: String,
    dateSettingsChanged:{
      username: Date,
      email: Date,
      password: Date
    }
  });

var userModel = mongoose.model('users', userSchema);

module.exports = userModel;