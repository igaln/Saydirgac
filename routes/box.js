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