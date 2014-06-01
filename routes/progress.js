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

// index
// GET /progress/dashboard/
router.get('/dashboard/live', function(req, res) {


  var data = {};

  Progress.find(function(err, progresses){
   
      // progresses.forEach(function(progress){

      //       if(progress.type = "Event") {
      //           data.child = {"Event", progress}; 
      //       }
      // });

      // data.child.children = [];

      // progresses.forEach(function(progress){

      //       if(progress.type = "City") {
      //           data.child.children.push = {"City" :progress};
      //       }

      // });

      res.render('progress_dashboard', {
        title: 'Durum',
        // data: data,
        progresses:progresses
      });
    
  });
});


module.exports = router;