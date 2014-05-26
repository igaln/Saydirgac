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
router.get('/:format?', function(req, res) {

  console.log(req.params);

  Progress.find(function(err, progresses){
    if (req.params.format) {
      res.json(progresses);
    }else{
      res.render('progress_index', {
        title: 'Durum',
        progresses: progresses
      });
    }
  });

});

module.exports = router;