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
  console.log(findUser);
  
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
      prefLang: 'fr',
      wishlist: [],
      APIkey: ''
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
      urlToImage: req.body.articleImg
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
    console.log(user);
    
  }

  res.json({APIkey: user.APIkey})
})

console.log('L O C K E D  &  L O A D E D');
module.exports = router;