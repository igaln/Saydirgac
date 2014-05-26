var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.Types.ObjectId;

var Progress = new Schema({
  type:                     {type: String, required: true, index: true}, // event, city, district, no
  id:                       {type: String, required: true, index: true},        // event_city, city_district, district_no
  name:                     {type: String},
  box_count:                {type: Number, required: true},
  evidence_count:           {type: Number, default: 0},
  reading_count:            {type: Number, default: 0},                 // has to be distinct reading
  created_at:               {type: Date, default: Date.now},
  updated_at:               {type: Date, default: Date.now}
});

module.exports = mongoose.model('Progress', Progress);
