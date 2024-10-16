var express = require('express');
var router = express.Router();
var userModel = require('../models/users');

var bcrypt = require('bcrypt');
var uid2 = require('uid2');
const cost = 10;

router.put('/', async function (req, res, next) {
    var findUser = await userModel.findOne({
      token: req.body.token
    })
    if(findUser){
      var result, output, timing, check
      var date = new Date();
      var oneWeek = 604800000;
  
      var checkDates = (currentTime, lastTime, compareTime) => {
        var timePassed = currentTime - lastTime
        if(timePassed > compareTime){
          return true;
        } else {
          var timeRemaining = compareTime - timePassed
          return timeRemaining;
        }
    }
  
      if(req.body.username){
        if(findUser.dateSettingsChanged.username !== null ){
          var lastChanged = findUser.dateSettingsChanged.username.getTime()
          check = checkDates(date.getTime(), lastChanged, oneWeek)
        } else {
          check = true
        }
  
        if(check === true){
          findUser.username = req.body.username
          findUser.dateSettingsChanged.username = date
          var user = await findUser.save()
          output = user.username
          result = true
        } else {
          timing = check
          result = false
        }
      } 
  
      else if (req.body.email) {
        if(findUser.dateSettingsChanged.email !== null ){
          var lastChanged = findUser.dateSettingsChanged.email.getTime()
          check = checkDates(date.getTime(), lastChanged, oneWeek)
        } else {
          check = true
        }
  
        if(check === true){
          var findUserEmail = await userModel.findOne({
            email: req.body.email
          })
        
          if(findUserEmail != null){
            result = false;
            timing = null;
            output = req.body.email;
          } else {
            findUser.email = req.body.email
            findUser.dateSettingsChanged.email = date
            var user = await findUser.save()
            result = true
            output = user.email
          }
        } else {
          timing = check
          result = false
        }
      }
  
      else if (req.body.currentPassword) {
        var currentPassword = req.body.currentPassword;
        if(bcrypt.compareSync(currentPassword, findUser.password)){
  
  
          if(findUser.dateSettingsChanged.password !== null ){
            var lastChanged = findUser.dateSettingsChanged.password.getTime()
            check = checkDates(date.getTime(), lastChanged, oneWeek)
          } else {
            check = true
          }
  
          if(check === true){
            const newPassword = req.body.newPassword;
            const hash = bcrypt.hashSync(newPassword, cost);
            findUser.password = hash;
            findUser.token = uid2(32);
            findUser.dateSettingsChanged.password = date
            var user = await findUser.save();
            output = user.token;
            result = true
          } else {
            result = false;
            timing = check
          }
        } else {
          result = false;
        }
      }
    }
    res.json({result, output, timing})
})

router.put('/update-lang', async function(req, res, next){
  var update = false
  var findUser = await userModel.findOne({
    token: req.body.token
  })
  if (findUser){
    findUser.prefLang = req.body.lang
    var user = await findUser.save()
    update = [true, user.prefLang]
    res.json({ update })
  }
})

router.post('/addAPIkey', async function (req, res, next) {
    var findUser = await userModel.findOne({
      token: req.body.token
    })
    if(findUser){
      findUser.APIkey = req.body.apikey
      var user = await findUser.save()
    }
  
    res.json({APIkey: user.APIkey})
})

  router.delete('/delete-account', async function(req, res, next){
    var findUser = await userModel.findOne({
      token: req.body.token
    })
    if(findUser){
       var response = await userModel.deleteOne({ token: req.body.token });
       res.json({response})
    }
  })

module.exports = router;
