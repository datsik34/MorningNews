var express = require('express');
var router = express.Router();
var userModel = require('../models/users');

var bcrypt = require('bcrypt');
var uid2 = require('uid2');

const cost = 10;

router.post('/sign-up', async function(req, res, next) {
  var result;
  var findUser = await userModel.findOne({
    email: req.body.email
  })

  if(findUser != null){
    result = null
    res.json({result})
  } else {
    const password = req.body.password;
    const hash = bcrypt.hashSync(password, cost);
    var newUser = new userModel({
      username : req.body.username,
      email: req.body.email,
      password: hash,
      token: uid2(32),
      prefLang: 'us',
      wishlist: [],
      APIkey: '',
      dateSettingsChanged:{
        username: null,
        email: null,
        password: null
      },
      WeatherWidget:{
        currentCity: null,
        cityChanged: null
      }
    })
    var user = await newUser.save();
    user = user.email;
    
    res.json({user});
  }
})

router.post('/sign-in', async function(req, res, next){
  var user = null;
  var findUser = await userModel.findOne({
    email: req.body.email
  });
  var password = req.body.password;
  if (findUser){
    if (bcrypt.compareSync(password, findUser.password)) {
      var user = {
        userToken: findUser.token,
        userWishlist: findUser.wishlist,
        userFavorites: findUser.favorites,
        prefLang: findUser.prefLang,
        userName: findUser.username,
        email: findUser.email,
        APIkey: findUser.APIkey
      }
    }
  }
  res.json({ user });
})

module.exports = router;