/*
    Model: models/reading.js
    View: views/reading_*.ejs
*/

var express   = require('express');
var router    = express.Router();
var mongoose  = require('mongoose');

var Box       = mongoose.model('Box');
var Evidence  = mongoose.model('Evidence');
var Reading   = mongoose.model('Reading')


// index
// GET /readings
router.get('/', function(req, res) {

  Reading.find(function(err, readings){
    res.render('reading_index', {
      title: 'Okunanlar',
      readings: readings
    });
  });

});


// new reading
// GET /readings/new
router.get('/:evidence_id/new', function(req, res) {

var config =  req.app.get('config');

  Evidence.findById(req.params.evidence_id,function(err, evidence) {
    res.render('reading_buyuksehir_new', {
      title: 'Tutanak Oku',
      evidence:evidence,
      s3path: config.s3URL + config.s3Path
    });
  });

});


// show
// GET /readings/1/reading
router.get('/:id/reading', function(req, res) {

  Reading.findById(req.params.id, function(err, reading) {
    res.render('reading_show', {
      title: 'Okunan no ' + req.params.id,
      reading: reading
    });
  });

});

// update
// PUT /readings/1
router.put('/', function(req, res) {

  var reading_id = reg.body.reading_id;

  var update_query = {
    updated_at: Date.now()
  }
  var update_filter = {
    _id: reading_id
  }

  Reading.findById(update_filter, update_query, function(err, reading_result) {

    if (err) return handleError(err);
     res.send(reading_result);
  });
});

// destroy
// DELETE /readings/1
router.delete('/', function(req, res) {

  var reading_id = req.body.reading_id;

  Reading.fineOneAndRemove(reading_id, function(err, reading_result) {
    if (err) return handleError(err);
    res.send(reading_result);
  });

});


module.exports = router;

var handleError = function(err){
  console.log(err);
}