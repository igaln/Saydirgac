var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

// var Candidate = require('./candidate');
var Event = require('./event');
// var Reading = require('./reading');

var Evidence = new Schema({
  box:                  {id: ObjectId, no: String},
  event:             { type : Schema.ObjectId, ref : 'Event' },
  img:                  {type: String, default: ''},
  // event:                {id: ObjectId, name: {type:String, required: true}},
  // candidates:           [{id: ObjectId, party: String, person: String}],
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

