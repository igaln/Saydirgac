/*
    REST Controller for basic evidence operations on the 
    Model: models/evidence.js 
    View: views/evidence.ejs
*/

var express         = require('express');
var router          = express.Router();
var mongoose        = require('mongoose');
var model_evidence  = mongoose.model( 'Evidence' );

router.get('/', function(req, res) {
   
   model_evidence.find( function ( err, evidence_result, count ){
  			res.render('sandik', { title: 'Evidence', evidence: evidence_result });
  		});

});

router.put('/', function(req, res) {

  var evidence_id = reg.body.evidence_id;

  var update_query = {updated_at:Date.now()}
  var update_filter = {_id:evidence_id}

  model_evidence.findById(update_filter,update_query, function ( err, evidence_result ){

            if (err) return handleError(err);
            res.send(evidence_result);      
  });
});

router.delete('/', function(req, res) {

  var evidence_id = reg.body.evidence_id;

  model_evidence.fineOneAndRemove(evidence_id, function ( err, evidence_result ){
          if (err) return handleError(err);
            res.send(evidence_result);
  });

});

router.post('/', function(req, res) {

  var event_id = req.body.event_id;

  

  new model_evidence({
    il    : "yalova",
    no : req.body.sandiknum,
    date_created : Date.now()
  }).save( function( err, todo, count ){
    res.redirect( '/sandik' );
  });

});

module.exports = router;