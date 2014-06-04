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

  Progress.find({}).populate('reading').exec(function(err, progresses){
      res.render('progress_dashboard', {
        title: 'Durum',
        // data: data,
        progresses:progresses
      });
    
  });
});

// index
// GET /progress/dashboard/
router.get('/dashboard/unread/:format?', function(req, res) {

  var results = [];

  Progress
        .find({evidence_count:0}).exec(function(err, progresses){
           if (err) return handleError(err);

        progresses.forEach(function(progress) {
              if(progress.type == "Box") {
                results.push(progress);
              }

        });
          if (req.params.format) {
              res.json(results);
          }else{
            res.render('progress_index', {
              title: 'Durum',
              progresses: results
            });
          }

      
  });
});


module.exports = router;