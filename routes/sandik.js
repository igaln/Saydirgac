var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Sandik  = mongoose.model( 'Sandik' );

router.get('/', function(req, res) {
   Sandik.find( function ( err, sandik, count ){
  			res.render('sandik', { title: 'Sandik',sandiklar:sandik });
  		});
});



 //    date_created: {type: Date, default: Date.now},
 //    author: {type: String, default: 'Anon'},
 //    il: {type: String, default: ''},
 //    ilce: {type: String, default: ''},
 //    no: {type: String, default: ''},

router.post('/', function(req, res) {
  
  new Sandik({
    il    : "yalova",
    no : req.body.sandiknum,
    date_created : Date.now()
  }).save( function( err, todo, count ){
    res.redirect( '/sandik' );
  });

});


module.exports = router;