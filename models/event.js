var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var evidence = require('./evidence');

var event = new Schema({
  name:           {type: String, default: "", index: true}, // Turkiye 2014 Yerel Seçimi
  country:        {type: String, default: ''},              // Turkiye
  type:           {type: String, default: ''},              // Yerel Seçim
  start_date:     {type: Date, default: Date.now},          // 30 Mart 2014
  created_at:     {type: Date, default: Date.now},
  updated_at:     {type: Date, default: Date.now},
  user:           {type: String, default: ''},
  evidences:      [evidence]
});

module.exports = mongoose.model('Event', event);