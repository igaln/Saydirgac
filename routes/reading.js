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
router.get('/',auth, function(req, res) {
  Reading.find(function(err, readings){
    res.render('reading_index', {
      title: 'Okunanlar',
      readings: readings
    });
  });
});

router.get('/getrandomreading', function(req,res) {

  var types =  require('../config/types.json');
  var config =  req.app.get('config');

  Evidence.findOne({read:false,locked:false},function(err,evidence) {

    if (err) return handleError(err);

    console.log(evidence);

    if(evidence === undefined || evidence === null) {

         res.redirect("/readings/new");
         return;
    }

    evidence.locked = true;
    evidence.updated_at = Date.now();

    //todo: check the process of editing unfinished eviences
    if(!evidence.entered) {

        res.redirect('/evidences/' + evidence.id + '/edit');

    };

    evidence.save(function(err,evidence) {

           if (err) return handleError(err);

               // find all candidates related to the ballot on the evidence and send to template
              Candidate.find({city:evidence.city,district:evidence.district,boxno:evidence.no}, function(err, candidates) {
                 if (err) return handleError(err);

                  console.log("FOUND CANDIES" + candidates);

                  res.render('reading_new_cumhurbaskanligi', {
                    title: 'Tutanak Oku',
                    evidence:evidence,
                    candidates:candidates,
                    s3path: config.s3URL + config.s3Path,
                    types:types
                  });
              }); // Candidate Query
           
      });
  });
});

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

      if (events.length > 0)
          Evidence.count({entered:true,read:false,resolved:false,locked:false},function(err, evidence_count){

            console.log(evidence_count + " buldum");

            res.render('reading_landing', {
              title: 'Tutanak kanıtı say',
              current_event: events[0],
              types:types,
              evidence_count:evidence_count
            });
          });
      else
        res.send("Sorry, nothing is happening in the world.")
    });

});



// new reading
// GET /readings/new
router.get('/:evidence_id/new', function(req, res) {

  var config =  req.app.get('config');
  var types =  require('../config/types.json');

  // first pull the evidence TODO: 2 type of templates according to Evidence
  Evidence.findById(req.params.evidence_id,function(err, evidence) {

    if (err) return handleError(err);

    if(!evidence){
        res.redirect('/progress/president/live');
    }

    if(evidence == null)
         res.redirect('/progress/president/live');

    if(evidence.read) {
      console.log("ALREADY READ");
      res.redirect('/readings/' + evidence.reading  + '/show');
    } if(evidence.locked) {
      console.log("BeING READ");

       res.redirect(req.header('Referer') || '/');
    } else {

      evidence.locked = true;
      evidence.updated_at = Date.now();
      evidence.save(function(err,evidence) {

        console.log(evidence);

              if (err) return handleError(err);

              // find all candidates related to the ballot on the evidence and send to template
              Candidate.find({city:evidence.city,district:evidence.district,boxno:evidence.no}, function(err, candidates) {

                  res.render('reading_new_cumhurbaskanligi', {
                    title: 'Tutanak Oku',
                    evidence:evidence,
                    candidates:candidates,
                    s3path: config.s3URL + config.s3Path,
                    types:types
                   // user:req.session.user
                  });
              }); // Candidate Query

        });
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

      // find all candidates related to the ballot on the evidence and send to template
      Candidate.find({city:reading.evidence.city,district:reading.evidence.district,boxno:reading.evidence.no}, function(err, candidates) {

          res.render('reading_edit_cumhur', {
            title: 'Tutanak Edit',
            evidence:reading.evidence,
            reading:reading,
            candidates:candidates,
            s3path: config.s3URL + config.s3Path,
             types:types
          });
      }); // Candidate Query
  });
});

// show
// GET /readings/1/reading
router.get('/:id/show', function(req, res) {

  console.log("reading");

  Reading.findById(req.params.id).populate('evidence').exec(function(err, reading) {

     if (err) return handleError(err);

     if(!reading)
        res.redirect('/evidences');


    console.log("reading " + reading);

    var config =  req.app.get('config');
    var types =  require('../config/types.json');

        res.render('reading_show_cumhur', {
          title: 'Tutanak Goster',
          evidence:reading.evidence,
          reading:reading,
          baskan_results:reading.baskan_results,
          s3path: config.s3URL + config.s3Path,
          types:types
        });
    });
});
// show
// GET /readings/1/reading
router.get('/:evidence_id/thankyou', function(req, res) {

  var types =  require('../config/types.json');

    // first pull the evidence TODO: 2 type of templates according to Evidence
  Evidence.findById(req.params.evidence_id,function(err, evidence) {

    console.log("THANK YOU");

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
    if(evidence.read) {
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

  //req.session.user = req.body.twitterid;

  var types =  require('../config/types.json');

  Evidence.findById(req.body.evidence_id, function (err, evidence) {
    if (err) return handleError(err);

      Candidate.find({city:evidence.city,district:evidence.district,boxno:evidence.no}, function(err, candidates) {

          var evidence_reading = new Reading({});
          // Reading type and evidence
          evidence_reading.evidence   =  evidence._id;

          console.log("req.body.baskan_adaylar[0] " + req.body.baskan_adaylar);
           console.log("req.body.baskan_adaylar[0] " + req.body.baskan_adaylar[0]);

           console.log("candidate length " + candidates.length)

           var input_counter = 0;

           candidates.forEach(function(candidate) {

                //console.log("aday " + candidate.name + " OY " + req.body.baskan_adaylar[0]);

                candidate.vote = parseInt(req.body.baskan_adaylar[0][input_counter]);
                candidate.save(function(err,candidate) {
                     if (err) return handleError(err);
                });
                evidence_reading.baskan_results.push(
                                         {id    :   candidate._id,
                                          person :   candidate.name,
                                          votes  :   parseInt(req.body.baskan_adaylar[0][input_counter])
                                        });
                input_counter++;

                if(input_counter == candidates.length) {
                                 //save reading
                        evidence_reading.save(function(err,reading) {
                              if (err) return handleError(err);
                               //push reading into evidence array
                               evidence.reading = reading._id;
                               evidence.read = true;
                               evidence.locked = false;
                               //save updated evidence
                               evidence.save(function(err, evidence){

                                      Progress.findOne({city:evidence.city,district:evidence.district,boxno:evidence.no},function(err,progress){

                                                progress.reading = evidence_reading;
                                                progress.evidence = evidence;
                                                progress.completed = true;
                                                progress.save();

                                                 res.redirect('/readings/' + evidence._id + '/thankyou');
                                          
                                      });
                                      //res.redirect('/readings/' + evidence.city + '/' + evidence.district + '/' + evidence.no + '/' + evidence.type);
                               });
                        });

                }
           });  // end for adding candidates

      }); //Candidate Query

  }); //Evidence Query
});


// POST /readings
router.post('/edit', multipartMiddleware,function(req, res) {

  //req.body.evidence_id

 // req.session.user = req.body.twitterid;
  var types =  require('../config/types.json');

  Evidence.findById(req.body.evidence_id).populate("reading").exec(function (err, evidence) {
    if (err) return handleError(err);

    console.log("found evidence ", evidence );

      Candidate.find({city:evidence.city,district:evidence.district,boxno:evidence.no}, function(err, candidates) {

          var evidence_reading = new Reading({});
          // Reading type and evidence
          evidence_reading.evidence                            =   evidence._id;
          evidence_reading.resolved                            =   true;

           var input_counter = 0;
           candidates.forEach(function(candidate) {

                  candidate.vote = parseInt(req.body.baskan_adaylar[0][input_counter]);
                  candidate.save(function(err,candidate) {
                     if (err) return handleError(err);
                });
                evidence_reading.baskan_results.push(
                                         {id    :   candidate._id,
                                          person :   candidate.name,
                                          votes  :  parseInt(req.body.baskan_adaylar[0][input_counter]) 
                                        });
                input_counter++;
             
           });  // end for adding candidates

            //save reading
            evidence_reading.save(function(err,reading) {
                  if (err) return handleError(err);
                   //push reading into evidence array
                   evidence.reading = reading._id;
                   evidence.read = true;
                   evidence.flag = 0;
                   evidence.resolved = true;
                   //save updated evidence
                   evidence.save(function(err, evidence){

                          Progress.findOne({city:evidence.city,district:evidence.district,boxno:evidence.no},function(err,progress){

                                    progress.reading = evidence_reading;
                                    progress.evidence = evidence;
                                    progress.completed = true;
                                    progress.save();

                                     res.redirect('/evidences');
                              
                          });
                         // res.redirect('/readings/' + reading.id  + '/show');

                          //res.redirect('/readings/' + evidence.city + '/' + evidence.district + '/' + evidence.no + '/' + evidence.type);
                   });
            });
      }); //Candidate Query
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