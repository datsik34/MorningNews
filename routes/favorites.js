var express = require('express');
var router = express.Router();
var userModel = require('../models/users');

router.post('/add', async function (req, res, next){
    var status = null;
    var findUser = await userModel.findOne({
      token: req.body.token
    })
    if(findUser){
        var source = {
            category: req.body.category,
            description: req.body.description,
            id: req.body.id,
            name: req.body.name,
            url: req.body.url,
            country: req.body.country
        }
        findUser.favorites.push(source)
        var user = await findUser.save()
        if(user){
            status = 'ok';
        }
        res.json({status})
    }
})

router.delete('/delete', async function (req, res, next){
    var status = null;
    var findUser = await userModel.findOne({
      token: req.body.token
    })
    if(findUser){
        findUser.favorites = findUser.favorites.filter(source => (source.id !== req.body.id))
        var user = await findUser.save()
        if(user){
            status = 'ok';
        }
        res.json({status})
    }
})

module.exports = router;