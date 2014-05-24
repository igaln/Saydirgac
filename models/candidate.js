var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var candidate = new Schema({
  city:                 {type: String, default: '', index: true},
  district:             {type: String, default: '', index: true},
  party:                {type: String, default: "", index: true},
  person:               {type: String, default: ""},
  type:                 {type: String, default: '', index: true},
  created_at:           {type: Date, default: Date.now},
  updated_at:           {type: Date, default: Date.now}
});

module.exports = mongoose.model('Candidate', candidate);