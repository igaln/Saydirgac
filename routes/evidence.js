/*
    REST Controller for basic evidence operations on the
    Model: models/evidence.js
    View: views/evidence.ejs
*/

var express         = require('express');
var router          = express.Router();
var mongoose        = require('mongoose');

var Evidence        = mongoose.model( 'Evidence' );
var Event           = mongoose.model('Event');


// @arikan: controller yapisi CRUD ve RESTFUL olacak şekilde duzenlendi (rails'ten de bilinen)
// TODO: eksik CRUD fonksiyonlarini olusturmak lazim

// index
// GET /evidences

// show
// GET /evidences/1
router.get('/', function(req, res) {

   Evidence.find( function ( err, evidence_result, count ){
			res.render('evidence', { title: 'Tutanak kanıtı', evidence: evidence_result });
		});

});

// new
// GET /evidences/new

// edit
// GET /evidences/1/edit

// create
// POST /evidences
router.post('/', function(req, res) {

  var event_id      = req.body.event_id;
  var sandik_no     = req.body.sandik_no;

    new Evidence({
           no : sandik_no
    }).save( function( err, evidence, count ){


            Event.findById(event_id, function ( err, event_result ){

                  if (err) return handleError(err);

                  event_result.evidences.push(evidence);
                  res.redirect( '/evidence' );
            });

    });
});

// update
// PUT /evidences/1
router.put('/', function(req, res) {

  var evidence_id = reg.body.evidence_id;

  var update_query = {updated_at:Date.now()}
  var update_filter = {_id:evidence_id}

  Evidence.findById(update_filter,update_query, function ( err, evidence_result ){

            if (err) return handleError(err);
            res.send(evidence_result);
  });
});

// destroy
// DELETE /evidences/1
router.delete('/', function(req, res) {

  var evidence_id = reg.body.evidence_id;

  Event.fineOneAndRemove(evidence_id, function ( err, evidence_result ){
          if (err) return handleError(err);
            res.send(evidence_result);
  });

});


module.exports = router;