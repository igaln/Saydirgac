/*
    @igaln: Evidences REST Controller for basic evidence operations on the
    Model: models/evidence.js
    View: views/evidence_*.ejs
*/

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Evidence = mongoose.model('Evidence');
var Event = mongoose.model('Event');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();


// @arikan: controller yapisi CRUD ve RESTFUL olacak şekilde duzenlendi (rails'ten de bilinen)
// path /evidence yerine /evidences olabilir mi?

// index
// GET /evidences
router.get('/', function(req, res) {

  Evidence.find(function(err, evidences){
    res.render('evidence_index', {
      title: 'Tutanaklar',
      evidences: evidences
    });
  });

});


// show
// GET /evidences/1
router.get('/:id/evidence', function(req, res) {

  Evidence.findById(req.params.id, function(err, evidence) {
    res.render('evidence_show', {
      title: 'Tutanak ' + req.params.id,
      evidence: evidence
    });
  });

});

// new
// GET /evidences/new
router.get('/new', function(req, res) {

  // @igaln: using the latest Event to pass to evidences
  // this might not be the best practice moving forward,
  // TODO: best to have a interface to match events with evidences.

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
      res.render('evidence_new', {
        title: 'Yeni tutanak kanıtı gir',
        current_event: events[0]
      });
    else
      res.send("Sorry, nothing is happening in the world.")
  });

});

// edit
// GET /evidences/1/edit
router.get('/:id/edit', function(req, res) {

  var config =  req.app.get('config');
  var yskveri =  require('../config/ysksecimveri.json');

  Evidence.findById(req.params.id, function(err, evidence) {
    res.render('evidence_edit', {
      title: 'Tutanak ' + req.params.id + ' düzenle',
      evidence: evidence,
      s3path: config.s3URL + config.s3Path,
      yskveri: JSON.stringify(yskveri)
    });
  });

});

// router.get('/:il/:ilce/:sandikno/:type/edit', function(req, res) {

//   Evidence.findById(req.params.id, function(err, evidence) {
//     res.render('evidence_edit', {
//       title: 'Tutanak ' + req.params.id + ' düzenle',
//       evidence: evidence
//     });
//   });

// });

// POST /evidences
router.post('/', multipartMiddleware, function(req, res) {
  var started_at = Date.now();
  console.log(started_at);

  //begin s3 file upload
  var fs = require('fs');
  var AWS = require('aws-sdk');

  AWS.config.loadFromPath('./config/s3creds.json');
  AWS.config.update({
    region: 'us-east-1'
  });
  var s3 = new AWS.S3({
    apiVersion: '2006-03-01'
  });

  // Lists your s3 buckets, using this for debug
  // s3.listBuckets(function(err, data) {
  //     for (var index in data.Buckets) {
  //       var bucket = data.Buckets[index];
  //       console.log("Bucket: ", bucket.Name, ' : ', bucket.CreationDate);
  //     }
  // });

  // create filename string from date
  // TODO: make this a proper CITY + DISTRICT + NO and extension
  var d = Date.now();
  var filetosave = d.toString() + "_" + req.files.image.name;

  fs.readFile(req.files.image.path, function(err, data) {

    var params = {
      Bucket: "journosweb",
      Key: "sayman/images/" + filetosave,
      Body: data,
      ContentType: 'application/image'
    };

    s3.putObject(params, function(error, data) {

      if (error) {
        console.log(error);
        callback(error, null);
      } else {

        console.log("S3 uploaded, saving...");
        var doc = {
          city: req.body.city,
          district: req.body.district,
          no: req.body.no,
          type: req.body.type,
          img: filetosave
        };

        new Evidence(doc).save(function(err, evidence, count) {
          if (err) return handleError(err);

          //TODO: Make the data association in the model
          Event.findById(req.body.event_id, function(err, event) {
            if (err) return handleError(err);

            event.evidences.push(evidence);
            event.save(function(err, result) {
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

  Event.fineOneAndRemove(evidence_id, function(err, evidence_result) {
    if (err) return handleError(err);
    res.send(evidence_result);
  });

});


module.exports = router;