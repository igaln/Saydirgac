var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var provider = require('provider');

var candidate = new Schema({
  name:                {type: String, default: "", index: true}, // Party name
  alias:               {type: String, default: ""},              // Party person name
  evidence_vote_count: {type: Number, default: 0},
  provider_vote_count: {type: Number, default: 0},              // TODO: {provider: provider, count: Number}
  created_at:          {type: Date, default: Date.now},
  updated_at:          {type: Date, default: Date.now}
});

module.exports = mongoose.model('Candidate', candidate);