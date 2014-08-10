/*
    Candidates REST Controller
    Model: models/candidate.js
    View: views/candidate_*.ejs
*/

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Candidate = mongoose.model('Candidate');

// index
// GET /candidates
router.get('/', function(req, res) {

  //var types =  require('../config/types.json');

 // console.log(types);

 console.log("get candidates");

  Candidate.find().limit(50).exec(function(err, candidates){
    res.render('candidate_index', {
      title: 'Adaylar',
      candidates: candidates
    });
  });

});

// GET /candidates
router.get('/length', function(req, res) {


  Candidate.count(function(err, count){
      res.send({"length":count});
  });

});

router.get('/cities', function(req,res) {

   Candidate.find().distinct('city',function(err, cities){
        res.send(cities);
  });

});


router.get('/districts/:city',function(req,res) {


   Candidate.find( {city:req.params.city}).distinct('district', function(err, districts){
        res.send(districts);
  });

});

router.get('/boxes/:district', function(req,res) {


   Candidate.find({district:req.params.district}).distinct('boxno',function(err, boxes){
        res.send(boxes);
  });

});

module.exports = router;