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
var Candidate = mongoose.model('Candidate')

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();


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

  // first pull the evidence TODO: 2 type of templates according to Evidence
  Evidence.findById(req.params.evidence_id,function(err, evidence) {
      
    // find all candidates related to the ballot on the evidence and send to template
    Candidate.find({city:evidence.city,district:evidence.district}, function(err, candidates) {
        res.render('reading_buyuksehir_new', {
          title: 'Tutanak Oku',
          evidence:evidence,
          candidates:candidates,
          s3path: config.s3URL + config.s3Path
        });
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

// POST /readings
router.post('/', multipartMiddleware,function(req, res) {

  console.log(req.body);
  Evidence.findById(req.body.evidence_id, function (err, evidence) {
     if (err) return handleError(err);

      var reading_object = {};

    Candidate.find({city:evidence.city,district:evidence.district}, function(err, candidates) {
      
        // Basic Totals from Ballot
        reading_object.evidence                     =   evidence._id;
        reading_object.kayitli_secmen               =   req.body.kayitli_secmen
        reading_object.oy_kullanan_secmen           =   req.body.oy_kullanan_secmen
        reading_object.kanunen_oy_kullanan_secmen   =   req.body.kanunen_oy_kullanan_secmen
        reading_object.toplam_oy_kullanan_secmen    =   req.body.toplam_oy_kullanan_secmen
        reading_object.sandiktan_cikan_zarf_sayisi  =   req.body.sandiktan_cikan_zarf_sayisi
        reading_object.gecerli_zarf_sayisi          =   req.body.gecerli_zarf_sayisi
        reading_object.itirazsiz_gecerli_oy         =   req.body.itirazsiz_gecerli_oy
        reading_object.itirazli_gecerli_oy          =   req.body.itirazli_gecerli_oy
        reading_object.gecerli_oy                   =   req.body.gecerli_oy
        reading_object.gecersiz_oy                  =   req.body.gecersiz_oy
        reading_object.toplam_gecerli_oy            =   req.body.toplam_gecerli_oy

        // Add Candidates
        var evidence_reading = new Reading(reading_object);
        for(var k =0; k < candidates.length; k++) {
          evidence_reading.results.push(
                                  {_id    :   candidates[k]._id,
                                    party  :   candidates[k].party,
                                    person :   candidates[k].person,
                                    type   :   candidates[k].type,
                                    votes  :   req.body.adaylar[0][k]
                                  })
        } // end for adding candidates

          //save reading
          evidence_reading.save(function(err,reading) {

                 console.log("reading:" + reading);

                 //push reading into evidence array
                 evidence.readings.push({id: reading.id, flag: 0, resolved: true});
                 //save updated evidence
                 evidence.save(function(err, evidence){
                        //show city results
                        res.redirect('/results/city/' + evidence.city);
                 })
                 

          }); 
    });
  })
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