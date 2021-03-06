/*
    Evidences REST Controller
    Model: models/evidence.js
    View: views/evidence_*.ejs
*/

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Evidence = mongoose.model('Evidence');
var Event = mongoose.model('Event');
var Box = mongoose.model('Box');
var Progress = mongoose.model('Progress');
var Candidate = mongoose.model('Candidate');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var connect = require('connect');
var auth = connect.basicAuth('saydirac', 'saydirac');

// index
// GET /evidences
router.get('/', function(req, res) {
  var config =  req.app.get('config');
  var types =  require('../config/types.json');
  var moment = require('moment');

  

  Evidence.find({}).populate('reading').exec(function(err, evidences){
      res.render('evidence_index', {
        title: 'Tutanaklar',
        s3path: config.s3URL + config.s3Path,
        evidences: evidences,
        types: types, 
        moment: moment
      });
  });
});


// index  evidences to be counted
// GET /evidences/say
router.get('/say', function(req, res) {

  Evidence.find({locked:false}).populate('reading').exec(function(err, evidences){
      res.render('evidence_index', {
        title: 'Okunacak Tutanaklar',
        evidences: evidences
      });
  });
});


// show
// GET /evidences/1
router.get('/:id/evidence', function(req, res) {

  var types =  require('../config/types.json');

  Evidence.findById(req.params.id, function(err, evidence) {
    res.render('evidence_show', {
      title: 'Tutanak ' + req.params.id,
      evidence: evidence,
      types:types
    });
  });

});

// new
// GET /evidences/new
router.get('/new', function(req, res) {


  console.log(req.session.user);

  var types =  require('../config/types.json');
  var options = {
    limit: 1,
    sort: {
      date_added: 1 //Sort by Date Added ASC
    }
  }
  var filter = {};

  Event.find(filter, 'name', options, function(err, events) {
    if (events.length > 0){
      Progress.findOne({type:'Event'},function(err, progress){
        res.render('evidence_new', {
        title: 'Tutanak kanıtı gir',
        current_event: events[0],
        types: types,
        progress: progress
      });
    });
    }else{
      res.send("Sorry, nothing is happening in the world.")
    }
  });

});

// edit
// GET /evidences/1/edit
router.get('/:id/:edit', function(req, res) {

  var config =  req.app.get('config');
  var yskveri =  require('../config/event_data.json');
  var types =  require('../config/types.json');

  if(req.params.edit === "edit") {

    Evidence.findById(req.params.id, function(err, evidence) {

       Candidate.find().distinct('city',function(err, cities){
        console.log(cities);
            
             res.render('evidence_edit', {
              title: 'Tutanak Detaylarını Gir',
              evidence: evidence,
              message: false,
              s3path: config.s3URL + config.s3Path,
              yskveri: {},
              cities: JSON.stringify(cities)
          });
      });
     
    });

  } else if(req.params.edit === "show") {

      Evidence.findById(req.params.id, function(err, evidence) {
      res.render('evidence_show', {
        title: 'TUTANAK DETAYLARI',
        evidence: evidence,
        message:false,
        s3path: config.s3URL + config.s3Path,
        types:types
      });
    });
  } else if(req.params.edit === "saved") {

      Evidence.findById(req.params.id, function(err, evidence) {
      res.render('evidence_show', {
        title: 'TUTANAK DETAYLARI',
        evidence: evidence,
        message:"kayittesekkur",
        s3path: config.s3URL + config.s3Path,
        types:types
      });
    });
  }
});

router.get('/:city/:district/:boxno', function(req, res) {

  Evidence.find({city:req.params.city,district:req.params.district,no:req.params.boxno},function(err, evidences){
    res.render('evidence_index', {
      title: 'Tutanaklar',
      evidences: evidences
    });
  });

});

router.get('/:city/:district/:boxno/:type', function(req, res) {

  var evidence_key = req.params.city + "_" + req.params.district + "_" + req.params.boxno + "_" + req.params.type;
  var config =  req.app.get('config');

  Evidence.findOne(evidence_key, function(err, evidence) {
         res.render('evidence_show', {
              title: 'TUTANAK DETAYLARI',
              evidence: evidence,
              s3path: config.s3URL + config.s3Path
        });
  });

});

router.get('/flagged',auth,function(req,res){

    var config =  req.app.get('config');
    Evidence.find({flag: {$gt:0}}).populate('reading').exec(function(err,flagged_evidences) {
          res.render('evidence_flagged', {
                title: 'Flagged Evidences',
                evidences:flagged_evidences,
                s3path: config.s3URL + config.s3Path
              });
    })
});


// POST /flag
router.post('/flag',function(req,res){

    Evidence.findById(req.body.evidence_id,function(err,evidence) {
          if (err) return handleError(err);

          // Progress.find({$or:[{type:"City",id:evidence.event +'_'+ evidence.city},{type:"District",id:evidence.city + '_' + evidence.district},{type:"Event",id:evidence.event},{type:"Box",id:evidence.district + '_' + evidence.no}]},function(err,progress_results){

          //                       progress_results.forEach(function(progress){
          //                           progress.reading_count--;
          //                           progress.save();
          //                       })
          //                 });

          evidence.flag++;
          evidence.save(function(err,reading) {
                res.send( JSON.stringify({flagcount:evidence.flag}));
          });
    })
});



// POST /evidences
router.post('/', multipartMiddleware, function(req, res) {

  // if there is an image file in the post, create initial Evidence to be edited
  if(req.files) {

    var started_at = Date.now();
    console.log(started_at);
    //begin s3 file upload
    var fs = require('fs');
    var AWS = require('aws-sdk');

    
    //AWS.config.loadFromPath('./config/s3creds.json');

    //if(process.env.env === 'local')

    console.log(process.env.AWS_ACCESS_KEY_ID);
    console.log(process.env.AWS_SECRET_ACCESS_KEY);
   
    // AWS.config.update({
    //   region: 'us-east-1',
    //   accessKeyId: process.env.AWS_ACCESS_KEY,
    //   secretAccessKey: process.env.AWS_SECRET_KEY
    // });


      AWS.config.update({
      region: 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });

    var s3 = new AWS.S3({
      apiVersion: '2006-03-01'
    });

    var d = Date.now();
    var filetosave = d.toString() + "_" + req.files.image.name;

    fs.readFile(req.files.image.path, function(err, data) {

      var params = {
        Bucket: "journosweb",
        Key: "cumhurbaskanligi/images/" + filetosave,
        Body: data,
        ContentType: 'application/image'
      };

      s3.putObject(params, function(error, data) {

        if (error) {
          handleError(error, null);
        } else {

          console.log("S3 uploaded, saving...");

          Event.findById(req.body.event_id, function(err, event_result) {
            if (err) return handleError(err);

            new Evidence({ img: filetosave, event:req.body.event_id }).save(function(err, evidence, count) {
                  if (err) return handleError(err);
                   event_result.evidences.push(evidence._id);
                   event_result.save(function(err, result) {
                      if (err) return handleError(err);

                      res.redirect('/evidences/' + evidence.id + '/edit');
                   });
              });
          });

          var ended_at = Date.now();
          var seconds = Math.round((ended_at - started_at)/1000);
          console.log(seconds + " seconds");
        }
      });
    });

    } else {

        console.log("save evidence");

        Evidence.findOne({_id:req.body.event_id}, function (err, doc) {
           if (err) return handleError(err);

              doc.city = req.body.city;
              doc.district = req.body.district;
              doc.no = req.body.no;
              doc.entered = true;


              console.log("found evidence " +doc);

              //TODO: progress ad step
              // Progress.find({$or:[{type:"City",id:doc.event +'_'+ doc.city},{type:"District",id:doc.city + '_' + doc.district},{type:"Event",id:doc.event},{type:"Box",id:doc.district + '_' + doc.no}]},function(err,progress_results){

              //       progress_results.forEach(function(progress){
              //           progress.evidence_count++;
              //           progress.save();
              //       })
              // });

              doc.save(function(err, doc) {
                  if (err) return handleError(err);

                  console.log("saved evidence");
                  res.send(doc);
              });
        })
    } //if
});

// update
// PUT /evidences/1
router.put('/', function(req, res) {

  var evidence_id = reg.body.evidence_id;

  var update_query = {
    updated_at: Date.now()
  }
  var update_filter = {
    _id: evidence_id
  }

  Evidence.findById(update_filter, update_query, function(err, evidence_result) {

    if (err) return handleError(err);
    res.send(evidence_result);
  });
});

// destroy
// DELETE /evidences/1
router.delete('/', function(req, res) {

  var evidence_id = reg.body.evidence_id;

  Evidence.fineOneAndRemove(evidence_id, function(err, evidence_result) {
    if (err) return handleError(err);
    res.send(evidence_result);
  });

});


module.exports = router;

var handleError = function(err){
  console.log(err);
}