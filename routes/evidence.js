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

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

// @arikan: controller yapisi CRUD ve RESTFUL olacak şekilde duzenlendi (rails'ten de bilinen)
// TODO: eksik CRUD fonksiyonlarini olusturmak lazim
// path /evidence yerine /evidences olabilir mi?
// views/evidence.js simdilik kaldirildi yerine controller match eden evidence_show evidence_new gibi dosyalar geldi

// index
// GET /evidences

// show
// GET /evidences/1
router.get('/:id', function(req, res) {

  Evidence.findById(req.params.id, function (err, evidence) {
    res.render('evidence_show', { title: 'Tutanak '+ req.params.id, evidence: evidence });
  });

});

// new
// GET /evidences/new
router.get('/', function(req, res) {
  // TODO: burada gariplik var inatla evidence_show view render ediyor...
  // new form gostermek isterken veri cekmeye gerek yok, bu Model wrapper lazim mi?

  // burda URL pathde /:id olmadigi icin, :id pas edilen yerde yukardaki route u yukluyor, o yuuzden show view u render edyor
  Evidence.findById(req.params.id, function (err, evidence) {
    res.render('evidence_new', {title: 'Yeni tutanak kanıtı gir'});
  });

});

// edit
// GET /evidences/1/edit
router.get('/:id/edit', function(req, res) {

  Evidence.findById(req.params.id, function (err, evidence) {
    res.render('evidence_edit', { title: 'Tutanak '+ req.params.id + ' düzenle', evidence: evidence });
  });

});


router.post('/', multipartMiddleware,function(req, res) {


  // post params
   var city = req.body.city;
   var district = req.body.district;
   var evidenceno = req.body.no;

  //begin s3 file upload
  var fs = require('fs');
  var AWS = require('aws-sdk');

  AWS.config.loadFromPath('./s3creds.json');
  AWS.config.update({region: 'us-east-1'});
  var s3 = new AWS.S3({apiVersion: '2006-03-01'});

      // Lists your s3 buckets, using this for debug 
      // s3.listBuckets(function(err, data) {
      //     for (var index in data.Buckets) {
      //       var bucket = data.Buckets[index];
      //       console.log("Bucket: ", bucket.Name, ' : ', bucket.CreationDate);
      //     }
      // });


      // create filename string from date 
      //TODO: make this a proper CITY + DISTRICT + NO and extension
      var d = Date.now();
      var filetosave  = d.toString() + "_" + req.files.image.name;
   
    fs.readFile(req.files.image.path, function (err, data) {  
      
       var params = {
            Bucket: "journosweb", 
            Key:  "sandik/images/" + filetosave, 
            Body: data,
            ContentType: 'application/image'
        };

       s3.putObject(params, function(error, data) {
           
            if (error) {
                console.log(error);
                callback(error, null);
            } else {
                // callback(null, pdf_key);
               
                   

                    var doc = {city:city,district:district,no:evidenceno,img:filetosave};


                    new Evidence(doc).save( function( err, evidence, count ){
                          if (err) return handleError(err);
                          res.redirect( '/evidence' );
                          
                          //TODO: (igaln, bind event id )
                          // Event.findById(event_id, function ( err, event_result ){

                          //       if (err) return handleError(err);

                          //       event_result.evidences.push(evidence);
                          //       res.redirect( '/evidence' );
                          // });

                    });
            }
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