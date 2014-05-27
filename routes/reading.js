/*
    Model: models/reading.js
    View: views/reading_*.ejs
*/

var express   = require('express');
var router    = express.Router();
var mongoose  = require('mongoose');

var Box       = mongoose.model('Box');
var Evidence  = mongoose.model('Evidence');
var Reading   = mongoose.model('Reading');
var Candidate = mongoose.model('Candidate');
var Progress  = mongoose.model('Progress');

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
  var types =  require('../config/types.json');

  // first pull the evidence TODO: 2 type of templates according to Evidence
  Evidence.findById(req.params.evidence_id,function(err, evidence) {

    if(types.evidence[evidence.type] == 'İlçe Belediye Başkanlığı ve Belediye Meclis Üyeliği Sonuç Tutanağı') {

      // find all candidates related to the ballot on the evidence and send to template
      Candidate.find({city:evidence.city,district:evidence.district,$or:[{type:"ilce_belediye_baskanligi"},{type:"belediye_meclis_uyeligi"}]}, function(err, candidates) {


          res.render('reading_new_ilce_belediye', {
            title: 'Tutanak Oku',
            evidence:evidence,
            candidates:candidates,
            s3path: config.s3URL + config.s3Path,
             types:types
          });
      }); // Candidate Query

    } else if(types.evidence[evidence.type] == 'İl Belediye Başkanlığı Sonuç Tutanağı') {

       // find all candidates related to the ballot on the evidence and send to template
      Candidate.find({city:evidence.city,district:evidence.district,type:"il_belediye_baskanligi"}, function(err, candidates) {
          res.render('reading_new_buyuksehir', {
            title: 'Tutanak Oku',
            evidence:evidence,
            candidates:candidates,
            s3path: config.s3URL + config.s3Path,
            types:types
          });
      }); // Candidate Query
    }
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


// show
// GET /readings/1/reading
router.get('/:city/:district/:no/:type', function(req, res) {

  var config =  req.app.get('config');
  var types =  require('../config/types.json');

  console.log("omg");
  //find Reading
  Evidence.findOne({city:req.params.city,district:req.params.district,no:req.params.no,type:req.params.type},function(err, evidence) {

    console.log(evidence);

    if(!evidence) {
        // NO EVIDENCE ASK FOR ONE
    }

    if(evidence.readings.length > 0) {

      Reading.findById(evidence.readings[0].id,function(err,reading){

            if(types.evidence[evidence.type] == 'İlçe Belediye Başkanlığı ve Belediye Meclis Üyeliği Sonuç Tutanağı') {

              res.render('reading_show_ilce_belediye', {
                title: 'Tutanak Oku',
                evidence:evidence,
                reading:reading,
                baskan_results:reading.baskan_results,
                meclis_results:reading.meclis_results,
                s3path: config.s3URL + config.s3Path,
                types:types
              });

            } else if(types.evidence[evidence.type] == 'İl Belediye Başkanlığı Sonuç Tutanağı') {

              //console.log(reading.baskan_results);

              reading.baskan_results.forEach(function(res) {
                  console.log(res.person);
              })

              res.render('reading_show_buyuksehir', {
                title: 'Tutanak Goster',
                evidence:evidence,
                reading:reading,
                baskan_results:reading.baskan_results,
                s3path: config.s3URL + config.s3Path,
                 types:types
              });
            }
      });
    } else {
        //NO READING, ASK TO READ
    }
  });
});


// POST /readings
router.post('/', multipartMiddleware,function(req, res) {

  var types =  require('../config/types.json');

  Evidence.findById(req.body.evidence_id, function (err, evidence) {
    if (err) return handleError(err);

    if(types.evidence[evidence.type] == 'İlçe Belediye Başkanlığı ve Belediye Meclis Üyeliği Sonuç Tutanağı') {

      Candidate.find({city:evidence.city,district:evidence.district,$or:[{type:"ilce_belediye_baskanligi"},{type:"belediye_meclis_uyeligi"}]}, function(err, candidates) {

          var evidence_reading = new Reading({});
          // Reading type and evidence
          evidence_reading.evidence                            =   evidence._id
          evidence_reading.type                                =   evidence.type

          // Totals Begin
          evidence_reading.baskan_kayitli_secmen               =   req.body.baskan_kayitli_secmen
          evidence_reading.baskan_oy_kullanan_secmen           =   req.body.baskan_oy_kullanan_secmen
          evidence_reading.baskan_kanunen_oy_kullanan_secmen   =   req.body.baskan_kanunen_oy_kullanan_secmen
          evidence_reading.baskan_toplam_oy_kullanan_secmen    =   req.body.baskan_toplam_oy_kullanan_secmen
          evidence_reading.baskan_sandiktan_cikan_zarf_sayisi  =   req.body.baskan_sandiktan_cikan_zarf_sayisi
          evidence_reading.baskan_gecerli_zarf_sayisi          =   req.body.baskan_gecerli_zarf_sayisi
          evidence_reading.baskan_itirazsiz_gecerli_oy         =   req.body.baskan_itirazsiz_gecerli_oy
          evidence_reading.baskan_itirazli_gecerli_oy          =   req.body.baskan_itirazli_gecerli_oy
          evidence_reading.baskan_gecerli_oy                   =   req.body.baskan_gecerli_oy
          evidence_reading.baskan_gecersiz_oy                  =   req.body.baskan_gecersiz_oy
          evidence_reading.baskan_toplam_gecerli_oy            =   req.body.baskan_toplam_gecerli_oy
          // Add Candidates

           var input_counter = 0;
           candidates.forEach(function(candidate) {

              if(candidate.type == "ilce_belediye_baskanligi") {

                candidate.vote = req.body.baskan_adaylar[0][input_counter];
                candidate.save();
                evidence_reading.baskan_results.push(
                                         {id    :   candidate._id,
                                          party  :   candidate.party,
                                          person :   candidate.person,
                                          type   :   candidate.type,
                                          votes  :   req.body.baskan_adaylar[0][input_counter]
                                        });
                input_counter++;
              }
           });  // end for adding candidates

          // Belediye Meclis Uyeleri
          evidence_reading.meclis_kayitli_secmen               =   req.body.meclis_kayitli_secmen
          evidence_reading.meclis_oy_kullanan_secmen           =   req.body.meclis_oy_kullanan_secmen
          evidence_reading.meclis_kanunen_oy_kullanan_secmen   =   req.body.meclis_kanunen_oy_kullanan_secmen
          evidence_reading.meclis_toplam_oy_kullanan_secmen    =   req.body.meclis_toplam_oy_kullanan_secmen
          evidence_reading.meclis_sandiktan_cikan_zarf_sayisi  =   req.body.meclis_sandiktan_cikan_zarf_sayisi
          evidence_reading.meclis_gecerli_zarf_sayisi          =   req.body.meclis_gecerli_zarf_sayisi
          evidence_reading.meclis_itirazsiz_gecerli_oy         =   req.body.meclis_itirazsiz_gecerli_oy
          evidence_reading.meclis_itirazli_gecerli_oy          =   req.body.meclis_itirazli_gecerli_oy
          evidence_reading.meclis_gecerli_oy                   =   req.body.meclis_gecerli_oy
          evidence_reading.meclis_gecersiz_oy                  =   req.body.meclis_gecersiz_oy
          evidence_reading.meclis_toplam_gecerli_oy            =   req.body.meclis_toplam_gecerli_oy

            var input_counter = 0;
            candidates.forEach(function(candidate) {

              if(candidate.type == "belediye_meclis_uyeligi") {

                candidate.vote = req.body.meclis_adaylar[0][input_counter];
                candidate.save();
                evidence_reading.baskan_results.push(
                                         {id    :   candidate._id,
                                          party  :   candidate.party,
                                          person :   candidate.person,
                                          type   :   candidate.type,
                                          votes  :   req.body.meclis_adaylar[0][input_counter]
                                        });
                input_counter++;
              }
           });  // end for adding candidates

            //save reading
            evidence_reading.save(function(err,reading) {
                  if (err) return handleError(err);
                   //push reading into evidence array
                   evidence.readings.push({id: reading.id, flag: 0, resolved: true});
                   //save updated evidence
                   evidence.save(function(err, evidence){


                          Progress.find({$or:[{type:"City",id:evidence.event +'_'+ evidence.city},{type:"District",id:evidence.city + '_' + evidence.district},{type:"Event",id:evidence.event},{type:"Box",id:evidence.district + '_' + evidence.no}]},function(err,progress_results){

                                progress_results.forEach(function(progress){
                                    progress.reading_count++;
                                    progress.save();
                                })
                          });
                          res.redirect('/readings/' + evidence.city + '/' + evidence.district + '/' + evidence.no + '/' + evidence.type);
                   });
            });
      }); //Candidate Query

    } else if(types.evidence[evidence.type] == 'İl Belediye Başkanlığı Sonuç Tutanağı') {

      Candidate.find({city:evidence.city,district:evidence.district,type:"il_belediye_baskanligi"}, function(err, candidates) {

          var evidence_reading = new Reading({});

           // Reading type and evidence
          evidence_reading.evidence                            =   evidence._id
          evidence_reading.type                                =   evidence.type

          // Total Begin
          evidence_reading.baskan_kayitli_secmen               =   req.body.baskan_kayitli_secmen
          evidence_reading.baskan_oy_kullanan_secmen           =   req.body.baskan_oy_kullanan_secmen
          evidence_reading.baskan_kanunen_oy_kullanan_secmen   =   req.body.baskan_kanunen_oy_kullanan_secmen
          evidence_reading.baskan_toplam_oy_kullanan_secmen    =   req.body.baskan_toplam_oy_kullanan_secmen
          evidence_reading.baskan_sandiktan_cikan_zarf_sayisi  =   req.body.baskan_sandiktan_cikan_zarf_sayisi
          evidence_reading.baskan_gecerli_zarf_sayisi          =   req.body.baskan_gecerli_zarf_sayisi
          evidence_reading.baskan_itirazsiz_gecerli_oy         =   req.body.baskan_itirazsiz_gecerli_oy
          evidence_reading.baskan_itirazli_gecerli_oy          =   req.body.baskan_itirazli_gecerli_oy
          evidence_reading.baskan_gecerli_oy                   =   req.body.baskan_gecerli_oy
          evidence_reading.baskan_gecersiz_oy                  =   req.body.baskan_gecersiz_oy
          evidence_reading.baskan_toplam_gecerli_oy            =   req.body.baskan_toplam_gecerli_oy
          // Add Candidates
          evidence_reading.baskan_results = [];

           var input_counter = 0;
           candidates.forEach(function(candidate) {

                candidate.vote = req.body.baskan_adaylar[0][input_counter];
                candidate.save();
                evidence_reading.baskan_results.push(
                                         {id    :   candidate._id,
                                          party  :   candidate.party,
                                          person :   candidate.person,
                                          type   :   candidate.type,
                                          votes  :   req.body.baskan_adaylar[0][input_counter]
                                        });

                input_counter++;
            });  // end for adding candidates

            var evidence_reading = new Reading(evidence_reading);
            //save reading
            evidence_reading.save(function(err,reading) {
                   if (err) return handleError(err);

                   //push reading into evidence array
                   evidence.readings.push({id: reading.id, flag: 0, resolved: true});
                   //save updated evidence
                   evidence.save(function(err, evidence){


                          Progress.find({$or:[{type:"City",id:evidence.event +'_'+ evidence.city},{type:"District",id:evidence.city + '_' + evidence.district},{type:"Event",id:evidence.event},{type:"Box",id:evidence.district + '_' + evidence.no}]},function(err,progress_results){

                                progress_results.forEach(function(progress){
                                    progress.reading_count++;
                                    progress.save();
                                })
                          });

                          res.redirect('/readings/' + evidence.city + '/' + evidence.district + '/' + evidence.no + '/' + evidence.type);
                   })
            });
      }); //Candidate Query
    } // if/else end for evidence type
  }); //Evidence Query
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