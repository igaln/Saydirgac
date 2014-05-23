/*
    Model: models/boxes.js
    View: views/boxes_*.ejs
*/

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Box = mongoose.model('Box');
var Evidence = mongoose.model('Evidence');
var Event = mongoose.model('Event');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

// index
// GET /boxes
router.get('/', function(req, res) {

  Box.find(function(err, boxes){
    res.render('box_index', {
      title: 'Sandıklar',
      boxes: boxes
    });
  });

});


router.get('/boxreduce',function(req, res) {

   var config =  req.app.get('config');

    var o = {};
    o.map = function () {
      emit({id:this.il_ilce_sandikno_tur,no:this.no,city:this.city,district:this.district}, {evidences:[this]})
    }
    o.reduce = function (k, values) {
      evidence_list = { evidences: [] };
      values.forEach(function (value) {
        evidence_list.evidences = value.evidences.concat(evidence_list.evidences);
      });
      return evidence_list;
    }

    Evidence.mapReduce(o, function (err, results) {
    if(err) throw err;

      results.forEach(function(value) {
        console.log(value);
      });

      res.render('box_reduced', {
        title: 'Sandıklar',
        s3path: config.s3URL + config.s3Path,
        boxes: results
      });
    })

});


// show
// GET /boxes/1
router.get('/:id/box', function(req, res) {

  Box.findById(req.params.id, function(err, box) {
    res.render('box_show', {
      title: 'Sandık no ' + req.params.id,
      box: box
    });
  });

});


// update
// PUT /evidences/1
router.put('/', function(req, res) {

  var box_id = reg.body.box_id;

  var update_query = {
    updated_at: Date.now()
  }
  var update_filter = {
    _id: box_id
  }

  Box.findById(update_filter, update_query, function(err, box_result) {

    if (err) return handleError(err);
    res.send(box_result);
  });
});

// destroy
// DELETE /evidences/1
router.delete('/', function(req, res) {

  var box_id = reg.body.box_id;

  Event.fineOneAndRemove(box_id, function(err, box_result) {
    if (err) return handleError(err);
    res.send(box_result);
  });

});


module.exports = router;

var handleError = function(err){
  console.log(err);
}