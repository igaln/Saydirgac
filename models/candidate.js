var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.Types.ObjectId;

var candidate = new Schema({
  event:                {type: ObjectId, ref: 'Event' },
  city:                 {type: String, default: '', index: true},
  district:             {type: String, default: '', index: true},
  party:                {type: String, default: "", index: true},
  person:               {type: String, default: ""},
  type:                 {type: String, default: '', index: true},
  vote:                 {type: Number},
  official_vote:        {type: Number},
  created_at:           {type: Date, default: Date.now},
  updated_at:           {type: Date, default: Date.now}
});

module.exports = mongoose.model('Candidate', candidate);