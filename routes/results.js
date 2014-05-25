/*
    @igal 
    Displaying results at different data points.
    Model: models/results.js
    View: views/boxes_*.ejs
*/

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Box       = mongoose.model('Box');
var Evidence  = mongoose.model('Evidence');
var Reading   = mongoose.model('Evidence');
var Event     = mongoose.model('Event');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

// index
// GET /boxes
router.get('/', function(req, res) {

  var yskveri =  require('../config/cities_districts.json');

    res.render('results_index', {
      title: 'SONUCLAR',
      veri: yskveri
    });


});

router.get('/reduced', function(req, res) {

    var o = {};
  o.map = function () {
    emit({id:this.il_ilce_sandikno_tur,no:this.no,city:this.city,district:this.district}, {evidences:[this]})
  }
  o.reduce = function (k, values) {
    evidence_list = { evidences: [] };
    values.forEach(function (value) {
      evidence_list.evidences = value.evidences.concat(evidence_list.evidences);
    });
    return evidence_list;
  }

  Evidence.mapReduce(o, function (err, results) {
  if(err) throw err;

      var config =  req.app.get('config');
      var yskveri =  require('../config/cities_districts.json');
      var boxes = [];

      for(var k=0; k< yskveri.cities.length; k++) {
        for(var j=0; j< yskveri.cities[k].districts.length; j++) {
          for(var z=0; z< yskveri.cities[k].districts[j].boxes.length; z++) {

              var boxobj = {
                    no        :   yskveri.cities[k].districts[j].boxes[z],
                    district  :   yskveri.cities[k].districts[j].name,
                    city      :   yskveri.cities[k].name,
                };

              //check all the results and calculate totals
              var foundData = false;
              results.forEach(function(value) {
                // console.log(value._id);
                // console.log("------------");
                // console.log(boxobj);
                  if(value._id.city == boxobj.city && value._id.district == boxobj.district && value._id.no == boxobj.no ) {
                      console.log("FOUND");
                      boxobj.data = value.value;
                      foundData = true;


                  }
              });

              if(!foundData) {
                //console.log("NOT FOUND");
                boxobj.data = null;
              }

              boxes.push(boxobj);
          }
        }
      }


      res.render('results_index_reduced', {
        title: 'SONUCLAR',
        s3path: config.s3URL + config.s3Path,
        boxes: boxes
      });

  });



});



// show
// GET /city/Ağrı
router.get('/city/:name', function(req, res) {

 Evidence.aggregate(  
    { $match: {city: req.params.name} }, 
    function (err, evidence) {
        if(err){
            return res.send(500, { error: err }); 
        }

        if(evidence) {
            return res.send(evidence);
        } else {
            res.send(500, { error: 'couldnt find evidence' }); 
        }
    }
);

});

// show
// GET /district/Diyadin
router.get('/district/:name', function(req, res) {

 Evidence.aggregate(  
    { $match: {district: req.params.name} }, 
    function (err, evidence) {
        if(err){
            return res.send(500, { error: err }); 
        }

        if(evidence) {
            return res.send(evidence);
        } else {
            res.send(500, { error: 'couldnt find evidence' }); 
        }
    }
);
});


// show
// GET /Ağrı/Diyadin/2
router.get('/:city/:district/:no', function(req, res) {

 Evidence.aggregate(  
    { $match: {district:req.params.district,city:req.params.city,no:req.params.no} }, 
    function (err, evidence) {
        if(err){
            return res.send(500, { error: err }); 
        }

        if(evidence) {
            return res.send(evidence);
        } else {
            res.send(500, { error: 'couldnt find expenses' }); 
        }
    }
);
});




module.exports = router;

var handleError = function(err){
  console.log(err);
}