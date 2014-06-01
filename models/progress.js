var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.Types.ObjectId;

var Reading = require('./reading');

var Progress = new Schema({
  type:                     {type: String, required: true, index: true}, // event, city, district, no
  id:                       {type: String, required: true, index: true},        // event_city, city_district, district_no
  name:                     {type: String},
  box_count:                {type: Number, required: true},             // num of uniqe boxes that has evidences, only iterate for event, city, district
  evidence_count:           {type: Number, default: 0},                 // has to be distinct evidence count
  reading_count:            {type: Number, default: 0},                 // has to be distinct reading count
  flag_count:               {type: Number, default: 0},
  created_at:               {type: Date, default: Date.now},
  updated_at:               {type: Date, default: Date.now},
  parent:                   {type: ObjectId, ref: 'Progress'},
  reading:                  {type: ObjectId, ref: 'Reading'}
});

module.exports = mongoose.model('Progress', Progress);
