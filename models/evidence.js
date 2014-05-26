var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.Types.ObjectId;

// var Candidate = require('./candidate');
// var Event = require('./event');
// var Reading = require('./reading');

var Evidence = new Schema({

  event:                {type: ObjectId, ref: 'Event'},
  img:                  {type: String, default: ''},
  city:                 {type: String, default: '', index: true},
  district:             {type: String, default: '', index: true},
  no:                   {type: String, default: '', index: true},
  type:                 {type: String, default: '', index: true},
  il_ilce_sandikno_tur: {type: String},
  neighbourhood:        {type: String, default: ''},
  user:                 {type: String, default: 'Anon'},
  readings:             [{id: ObjectId, flag: Number, resolved: Boolean}],
  created_at:           {type: Date, default: Date.now},
  updated_at:           {type: Date, default: Date.now}
  
});

module.exports = mongoose.model('Evidence', Evidence);

Evidence.post('validate', function (doc) {
    // console.log('evidence %s saved', doc._id);
    if(doc.city != null && doc.district != null && doc.no != null && doc.type != null){
      doc.il_ilce_sandikno_tur = doc.city + "_" + doc.district + "_" + doc.no + "_" + doc.type;
    }
    // console.log(doc);
});


// @arikan: adding an evidence to a box on save, this should be tested

// var Box = mongoose.model('Box');

// Evidence.post('save', function (evidence) {

//     Box.find({id: evidence.box.id}, function(err, boxes) {
//       if (err) return handleError(err);
//       var box = boxes[0];
//       box.evidences.push(evidence);

//       box.save(function(err, result) {
//         if (err) return handleError(err);
//         console.log("evidence %s saved", evidence.id);
//       });
//     });

//     console.log('%s has been saved', evidence._id);
// });

