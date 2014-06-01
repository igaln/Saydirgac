/*
    About REST Controller
    View: views/about.ejs
*/

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// index
// GET /kunye
router.get('/', function(req, res) {

  res.render('about', {
    title: 'Saydıraç Hakkında'
  });

});

module.exports = router;