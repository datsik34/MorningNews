var express = require('express');
var router = express.Router();
var userModel = require('../models/users');

router.post('/add', async function (req, res, next){
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

router.delete('/delete', async function (req, res, next){
  var status = null;
    var findUser = await userModel.findOne({
      token: req.body.token
    })
    if(findUser){
      if(req.body.title){
        findUser.wishlist = findUser.wishlist.filter(article => (article.title !== req.body.title))
        var user = await findUser.save()
        if(user){
          status = 'ok'
        }
        res.json({status})
      } else {
        findUser.wishlist = [];
        var user = await findUser.save()
        if(user){
          status = 'ok'
        }
        res.json({status})
      }
    }
})

module.exports = router;