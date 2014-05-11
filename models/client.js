var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var client = new Schema({
  name:                {type: String, default: "", index: true}, // Turkiyenin Oylari
  website:             {type: String, default: "", index: true}, // Turkiyeninoylari.com
  public_url:          {type: String, default: "", index: true}, // Turkiyeninoylari.com/sonuclar
  img:                 {type: String, default: ''},              // logo vs.
  created_at:          {type: Date, default: Date.now},
  updated_at:          {type: Date, default: Date.now}
});

module.exports = mongoose.model('Client', client);
