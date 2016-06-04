#!/usr/bin/env node
var express = require('express')
  , logger = require('morgan')
  , app = express();

app.use(logger('dev'))
app.use(express.static(__dirname + '/public'))
app.set('view engine', 'pug');
app.set('views', __dirname + '/views')

app.get('/', function (req, res, next) {
    res.render('index', { title: 'Curtis HomeSmarts'});
})

app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on http://localhost:' + (process.env.PORT || 3000))
})
