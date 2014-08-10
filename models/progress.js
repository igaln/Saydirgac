var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.Types.ObjectId;

// var Reading = require('./reading');
// var Evidence = require('./evidence');

var Progress = new Schema({

  type:                     {type: String, required: true, index: true},        // changed to 1 type of progress, by BOX IS
  
  csv_id:               {type:Number, default:0, index: true},
  city:                 {type: String, default: "", index: true},
  region:               {type: String, default: "", index: true},
  district:             {type: String, default: "", index: true},
  subdistrict:          {type: String, default: "", index: true},
  boxdistrict:          {type: String, default: "", index: true},
  boxno:                {type: String, default: "", index: true},


  created_at:               {type: Date, default: Date.now},
  updated_at:               {type: Date, default: Date.now},
  reading:                  {type: ObjectId, ref: 'Reading'},
  evidence:                 {type: ObjectId, ref: 'Evidence'},
  event:                    {type: ObjectId, ref: "Event"},

  completed:               {type: Boolean,default: false, index: true}
});

module.exports = mongoose.model('Progress', Progress);
