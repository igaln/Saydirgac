var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var candidate = new Schema({
  party:                {type: String, default: "", index: true},
  person:               {type: String, default: ""},
  city:                 {type: String, default: '', index: true},
  district:             {type: String, default: '', index: true},
  type:                 {type: String, default: '', index: true},
  created_at:           {type: Date, default: Date.now},
  updated_at:           {type: Date, default: Date.now}
});

module.exports = mongoose.model('Candidate', candidate);