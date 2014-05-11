/*
    REST Controller for basic evidence operations on the 
    Model: models/evidence.js 
    View: views/evidence.ejs
*/

var express         = require('express');
var router          = express.Router();
var mongoose        = require('mongoose');
var model_evidence  = mongoose.model( 'Evidence' );
var model_event     = mongoose.model('Event');

router.get('/', function(req, res) {
   
   model_evidence.find( function ( err, evidence_result, count ){
  			res.render('sandik', { title: 'Evidence', evidence: evidence_result });
  		});

});

// update evidence
router.put('/', function(req, res) {

  var evidence_id = reg.body.evidence_id;

  var update_query = {updated_at:Date.now()}
  var update_filter = {_id:evidence_id}

  model_evidence.findById(update_filter,update_query, function ( err, evidence_result ){

            if (err) return handleError(err);
            res.send(evidence_result);      
  });
});


// remove evidence
router.delete('/', function(req, res) {

  var evidence_id = reg.body.evidence_id;

  model_evidence.fineOneAndRemove(evidence_id, function ( err, evidence_result ){
          if (err) return handleError(err);
            res.send(evidence_result);
  });

});


// post new evidence
router.post('/', function(req, res) {

  var event_id      = req.body.event_id;
  var sandik_no     = req.body.sandik_no;

    new model_evidence({
           no : sandik_no
    }).save( function( err, evidence, count ){

            
            // model_event.findById(event_id, function ( err, event_result ){

            //       if (err) return handleError(err);

            //       event_result.evidences.push(evidence);
            //       res.redirect( '/evidence' );
            // });
           
    });
});

module.exports = router;