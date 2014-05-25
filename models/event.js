var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.Types.ObjectId;

var Evidence = require('./evidence');
// var Box = require('./box');

var Event = new Schema({
  name:           {type: String, default: '', index: true}, // Turkiye 2014 Yerel Seçimi
  country:        {type: String, default: ''},              // Turkiye
  type:           {type: String, default: ''},              // Yerel Seçim
  start_date:     {type: Date},                             // 30 Mart 2014
  user:           {type: String, default: ''},
  evidences:      [{type: ObjectId, ref : 'Evidence'}],
  // boxes:          [Box],
  created_at:     {type: Date, default: Date.now},
  updated_at:     {type: Date, default: Date.now}
});

module.exports = mongoose.model('Event', Event);