/*
    Progress REST Controller
    Model: models/progress.js
    View: views/progress_*.ejs
*/

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Progress = mongoose.model('Progress');
var Event = mongoose.model('Event');

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


router.get('/cumhur/live',function(req,res) {

   var types =  require('../config/types.json');
  var options = {
    limit: 1,
    sort: {
      date_added: 1 //Sort by Date Added ASC
    }
  }
  var filter = {};

  var results = {};
  var totalvotes  = 0;

  Event.find(filter, 'name', options, function(err, events) {
    if (events.length > 0){
      
      Progress.count({type:'BOX'},function(err, total){
        
        Progress.find({type:'BOX',completed:true}).populate("reading").exec(function(err, totalcompleted){

              totalcompleted.forEach(function(progress_item) {

                  //console.log(progress_item.reading.baskan_results[0]);

                  for(var i = 0; i < progress_item.reading.baskan_results.length; i++) {

                      console.log(progress_item.reading.baskan_results[i].votes);
                        
                        totalvotes += parseInt(progress_item.reading.baskan_results[i].votes);
                      if(results[progress_item.reading.baskan_results[i].person]) 
                        results[progress_item.reading.baskan_results[i].person] += parseInt(progress_item.reading.baskan_results[i].votes);
                      else
                        results[progress_item.reading.baskan_results[i].person] = parseInt(progress_item.reading.baskan_results[i].votes);
                  }
              });

              console.log(results);
              console.log("total votes " + totalvotes);


              res.render('progress_cumhur', {
              title: 'Durum',
              current_event: events[0],
              types: types,
              progress: {totalboxes:total,totalcompleted:totalcompleted.length},
              results:results,
              totalvotes:totalvotes
              });
        });
    });
    }else{
      res.send("Sorry, nothing is happening in the world.")
    }
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