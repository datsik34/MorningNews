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
        prefLang: findUser.prefLang,
        userName: findUser.username,
        email: findUser.email,
        APIkey: findUser.APIkey
      }
    }
  }
  res.json({ user });
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

router.post('/add-article', async function (req, res, next){
  var findUser = await userModel.findOne({
    token: req.body.token
  })
  if(findUser){
    var article = {
      title: req.body.articleTitle,
      description: req.body.articleDescr,
      urlToImage: req.body.articleImg,
      content: req.body.articleContent,
      url: req.body.articleUrl
    }
    findUser.wishlist.push(article)
    var user = await findUser.save()
    res.json({user: user.wishlist})
  }
})

router.delete('/del-article', async function (req, res, next){
  var findUser = await userModel.findOne({
    token: req.body.token
  })
  if(findUser){
    findUser.wishlist = findUser.wishlist.filter(article => (article.title !== req.body.title))
    var user = await findUser.save()
    res.json({user: user.wishlist})
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

router.put('/user-settings', async function (req, res, next) {
  var findUser = await userModel.findOne({
    token: req.body.token
  })
  if(findUser){
    var result, output, timing, check
    var date = new Date();
    var oneWeek = 604800000;
    var oneHour = 3600000

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
        findUser.email = req.body.email
        findUser.dateSettingsChanged.email = date
        var user = await findUser.save()
        result = true
        output = user.email
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

router.delete('/delete-account', async function(req, res, next){
  var findUser = await userModel.findOne({
    token: req.body.token
  })
  if(findUser){
     var response = await userModel.deleteOne({ token: req.body.token });
     res.json({response})
  }
})

console.log('L O C K E D  &  L O A D E D');
module.exports = router;