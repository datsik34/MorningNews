const mongoose = require('mongoose');

var articleSchema = mongoose.Schema({
    source: {
        id: String,
        name: String,
    },
    author: String,
    title: String,
    description: String,
    url: String,
    urlToImage: String,
    publishedAt: String,
    content: String
})

var sourceSchema = mongoose.Schema({
id: String,
name: String,
description: String,
url: String,
category: String,
language: String,
country: String,
articles: [articleSchema]
})

var dataSchema = mongoose.Schema({
    FR: [sourceSchema],
    UK: [sourceSchema],
    US: [sourceSchema],
    GER: [sourceSchema],
    ITA: [sourceSchema],
    RUS: [sourceSchema]
})


var dataModel = mongoose.model('data', dataSchema);

module.exports = dataModel;