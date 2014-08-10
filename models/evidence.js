var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.Types.ObjectId;


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
  // changed to single reading for decreasing complexity for round 1
  reading:              {type: ObjectId, ref: 'Reading'},
  locked:               {type: Boolean,default: false, index: true}, 
  entered:              {type: Boolean,default: false, index: true},  // initial entry for city,district,no,type
  read:                 {type: Boolean,default: false, index: true},  // reading of voting data
  flag:                 {type: Number, default: 0},
  resolved:             {type: Boolean, default: false},
  // readings:             [{id: ObjectId, flag: Number, resolved: Boolean}],
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
