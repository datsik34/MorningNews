var express = require('express');
var router = express.Router();
var userModel = require('../models/users');

router.post('/addcity', async function(req, res, next){
    var result
    var findUser = await userModel.findOne({
      token: req.body.token
    })
    if(findUser){
      findUser.WeatherWidget.currentCity = req.body.currentCity
      var user = await findUser.save()
      result = true;
    } else {
      result = false;
    }
    res.json({result})
  })
  

  router.post('/getcity', async function(req, res, next){
    var result
    var city = null;
    
    var findUser = await userModel.findOne({
      token: req.body.token
    })
    if(findUser.WeatherWidget.currentCity !== null){
      city = findUser.WeatherWidget.currentCity
      result = true
    } else {
      result= false
    }
    res.json({result, city})
  })
  
  module.exports = router;