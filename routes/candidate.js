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

  Candidate.find(function(err, candidates){
    res.render('candidate_index', {
      title: 'Adaylar',
      candidates: candidates
    });
  });

});

module.exports = router;