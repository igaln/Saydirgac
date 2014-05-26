/*
    Progress REST Controller
    Model: models/progress.js
    View: views/progress_*.ejs
*/

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Progress = mongoose.model('Progress');

// index
// GET /progress
router.get('/', function(req, res) {

  Progress.find(function(err, progresses){
    res.render('progress_index', {
      title: 'Durum',
      progresses: progresses
    });
  });

});

module.exports = router;