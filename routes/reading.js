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
var Event     = mongoose.model('Event');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var connect = require('connect');
var auth = connect.basicAuth('saydirac', 'saydirac');


// index
// GET /readings
router.get('/new', function(req, res) {

  var types =  require('../config/types.json');
  var options = {
    limit: 1,
    sort: {
      date_added: 1 //Sort by Date Added ASC
    }
  }
  var filter = {};

  Event.find(filter, 'name', options, function(err, events) {

    //@igaln: removed the Evidence query here, @arikan, not sure why it was being used.
    // we have to have at least 1 event to add evidences to
    if (events.length > 0)
      res.render('reading_landing', {
        title: 'Tutanak kanıtı say',
        current_event: events[0],
        types:types
      });
    else
      res.send("Sorry, nothing is happening in the world.")
  });

  Reading.find(function(err, readings){
    res.render('', {
      title: 'Tutanak Oku'
    });
  });
});

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

    if(evidence.locked) {
      console.log("ALREADY READ");
      res.redirect('/readings/' + evidence.reading  + '/reading');
    }

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


// new reading
// GET /readings/new
router.get('/:reading_id/edit', auth, function(req, res) {

  var config =  req.app.get('config');
  var types =  require('../config/types.json');

  // first pull the evidence TODO: 2 type of templates according to Evidence
  Reading.findById(req.params.reading_id).populate('evidence').exec(function(err, reading) {
  
    if(types.evidence[reading.evidence.type] == 'İlçe Belediye Başkanlığı ve Belediye Meclis Üyeliği Sonuç Tutanağı') {
      // find all candidates related to the ballot on the evidence and send to template
      Candidate.find({city:reading.evidence.city,district:reading.evidence.district,$or:[{type:"ilce_belediye_baskanligi"},{type:"belediye_meclis_uyeligi"}]}, function(err, candidates) {

          res.render('reading_edit_ilce_belediye', {
            title: 'Tutanak Oku',
            evidence:reading.evidence,
            reading:reading,
            candidates:candidates,
            s3path: config.s3URL + config.s3Path,
             types:types
          });
      }); // Candidate Query

    } else if(types.evidence[reading.evidence.type] == 'İl Belediye Başkanlığı Sonuç Tutanağı') {

       // find all candidates related to the ballot on the evidence and send to template
      Candidate.find({city:reading.evidence.city,district:reading.evidence.district,type:"il_belediye_baskanligi"}, function(err, candidates) {
          res.render('reading_edit_buyuksehir', {
            title: 'Tutanak Oku',
            evidence:reading.evidence,
            reading:reading,
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
  
  Reading.findById(req.params.id).populate('evidence').exec(function(err, reading) {
          
    var config =  req.app.get('config');
    var types =  require('../config/types.json');

      if(types.evidence[reading.evidence.type] == 'İlçe Belediye Başkanlığı ve Belediye Meclis Üyeliği Sonuç Tutanağı') {

        res.render('reading_show_ilce_belediye', {
          title: 'Tutanak Oku',
          evidence:reading.evidence,
          reading:reading,
          baskan_results:reading.baskan_results,
          meclis_results:reading.meclis_results,
          s3path: config.s3URL + config.s3Path,
          types:types
        });

      } else if(types.evidence[reading.evidence.type] == 'İl Belediye Başkanlığı Sonuç Tutanağı') {

        reading.baskan_results.forEach(function(res) {
            console.log(res.person);
        })

        res.render('reading_show_buyuksehir', {
          title: 'Tutanak Goster',
          evidence:reading.evidence,
          reading:reading,
          baskan_results:reading.baskan_results,
          s3path: config.s3URL + config.s3Path,
          types:types
        });
      }
    });
});

// show
// GET /readings/1/reading
router.get('/:evidence_id/thankyou', function(req, res) {

  var types =  require('../config/types.json');

    // first pull the evidence TODO: 2 type of templates according to Evidence
  Evidence.findById(req.params.evidence_id,function(err, evidence) {

    console.log(evidence);

   // if(evidence.locked) {
          res.render('reading_thankyou', {
            title: 'Tutanak Oku',
            evidence:evidence,
            types:types
          });
   // }
  });
});

// show
// GET /readings/1/reading
router.get('/:city/:district/:no/:type', function(req, res) {

  var config =  req.app.get('config');
  var types =  require('../config/types.json');

  //find Reading
  Evidence.findOne({city:req.params.city,district:req.params.district,no:req.params.no,type:req.params.type},function(err, evidence) {

    if(!evidence) {
        // NO EVIDENCE ASK FOR ONE
    }
    if(evidence.locked) {
      Reading.findById(evidence.reading.id,function(err,reading){

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

  //req.body.evidence_id
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
                evidence_reading.meclis_results.push(
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
                   evidence.reading = reading._id;
                   evidence.locked = true;
                   //save updated evidence
                   evidence.save(function(err, evidence){

                         
                          Progress.find({$or:[{type:"City",id:evidence.event +'_'+ evidence.city},{type:"District",id:evidence.city + '_' + evidence.district},{type:"Event",id:evidence.event},{type:"Box",id:evidence.district + '_' + evidence.no}]},function(err,progress_results){

                                progress_results.forEach(function(progress){
                                    progress.reading_count++;
                                    progress.save();
                                })
                          });
                          res.redirect('readings/' + evidence._id + '/thankyou');


                          //res.redirect('/readings/' + evidence.city + '/' + evidence.district + '/' + evidence.no + '/' + evidence.type);
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
                   evidence.reading = reading._id;
                   evidence.locked = true;
                   //save updated evidence
                   evidence.save(function(err, evidence){

                        
                          Progress.find({$or:[{type:"City",id:evidence.event +'_'+ evidence.city},{type:"District",id:evidence.city + '_' + evidence.district},{type:"Event",id:evidence.event},{type:"Box",id:evidence.district + '_' + evidence.no}]},function(err,progress_results){

                                progress_results.forEach(function(progress){
                                    progress.reading_count++;
                                    progress.save();
                                })
                          });

                          res.redirect('readings/' + evidence._id + '/thankyou');
                           
                   })
            });
      }); //Candidate Query
    } // if/else end for evidence type
  }); //Evidence Query
});


// POST /readings
router.post('/edit', multipartMiddleware,function(req, res) {

  //req.body.evidence_id
  var types =  require('../config/types.json');

  Evidence.findById(req.body.evidence_id).populate("reading").exec(function (err, evidence) {
    if (err) return handleError(err);

    console.log("found evidence ", evidence );

    // do not resolve the old reading, keep it as it is
    // if(evidence.reading) {
    //     console.log("update reading");
    //     evidence.reading.flag = 0;
    //     evidence.reading.resolved = true;
    //     evidence.reading.save();
    // }

    if(types.evidence[evidence.type] == 'İlçe Belediye Başkanlığı ve Belediye Meclis Üyeliği Sonuç Tutanağı') {

      Candidate.find({city:evidence.city,district:evidence.district,$or:[{type:"ilce_belediye_baskanligi"},{type:"belediye_meclis_uyeligi"}]}, function(err, candidates) {

          var evidence_reading = new Reading({});
          // Reading type and evidence
          evidence_reading.evidence                            =   evidence._id;
          evidence_reading.type                                =   evidence.type;
          evidence_reading.resolved                            =   true;

          // Totals Begin
          evidence_reading.baskan_kayitli_secmen               =   req.body.baskan_kayitli_secmen;
          evidence_reading.baskan_oy_kullanan_secmen           =   req.body.baskan_oy_kullanan_secmen;
          evidence_reading.baskan_kanunen_oy_kullanan_secmen   =   req.body.baskan_kanunen_oy_kullanan_secmen;
          evidence_reading.baskan_toplam_oy_kullanan_secmen    =   req.body.baskan_toplam_oy_kullanan_secmen;
          evidence_reading.baskan_sandiktan_cikan_zarf_sayisi  =   req.body.baskan_sandiktan_cikan_zarf_sayisi;
          evidence_reading.baskan_gecerli_zarf_sayisi          =   req.body.baskan_gecerli_zarf_sayisi;
          evidence_reading.baskan_itirazsiz_gecerli_oy         =   req.body.baskan_itirazsiz_gecerli_oy;
          evidence_reading.baskan_itirazli_gecerli_oy          =   req.body.baskan_itirazli_gecerli_oy;
          evidence_reading.baskan_gecerli_oy                   =   req.body.baskan_gecerli_oy;
          evidence_reading.baskan_gecersiz_oy                  =   req.body.baskan_gecersiz_oy;
          evidence_reading.baskan_toplam_gecerli_oy            =   req.body.baskan_toplam_gecerli_oy;
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
                evidence_reading.meclis_results.push(
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
                   evidence.reading = reading._id;
                   evidence.locked = true;
                   evidence.flag = 0;
                   evidence.resolved = true;
                   //save updated evidence
                   evidence.save(function(err, evidence){

                       
                          Progress.find({$or:[{type:"City",id:evidence.event +'_'+ evidence.city},{type:"District",id:evidence.city + '_' + evidence.district},{type:"Event",id:evidence.event},{type:"Box",id:evidence.district + '_' + evidence.no}]},function(err,progress_results){

                                progress_results.forEach(function(progress){
                                    progress.reading_count++;
                                    progress.save();
                                })
                          });
                          res.redirect('/readings/' + reading.id  + '/reading');

                          //res.redirect('/readings/' + evidence.city + '/' + evidence.district + '/' + evidence.no + '/' + evidence.type);
                   });
            });
      }); //Candidate Query

    } else if(types.evidence[evidence.type] == 'İl Belediye Başkanlığı Sonuç Tutanağı') {

      Candidate.find({city:evidence.city,district:evidence.district,type:"il_belediye_baskanligi"}, function(err, candidates) {

          var evidence_reading = new Reading({});

           // Reading type and evidence
          evidence_reading.evidence                            =   evidence._id
          evidence_reading.type                                =   evidence.type
          evidence_reading.resolved                            =   true;

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

            //save reading
            evidence_reading.save(function(err,reading) {
                   if (err) return handleError(err);

                   //push reading into evidence array
                   evidence.reading = reading._id;
                   evidence.locked = true;
                   evidence.flag = 0;
                   evidence.resolved = true;
                   //save updated evidence
                   evidence.save(function(err, evidence){

                        
                          Progress.find({$or:[{type:"City",id:evidence.event +'_'+ evidence.city},{type:"District",id:evidence.city + '_' + evidence.district},{type:"Event",id:evidence.event},{type:"Box",id:evidence.district + '_' + evidence.no}]},function(err,progress_results){

                                progress_results.forEach(function(progress){
                                    progress.reading_count++;
                                    progress.save();
                                })
                          });

                          res.redirect('/readings/' + reading.id  + '/reading');

                          //res.redirect('/readings/' + evidence.city + '/' + evidence.district + '/' + evidence.no + '/' + evidence.type);
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