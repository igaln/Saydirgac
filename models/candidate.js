var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.Types.ObjectId;

var Candidate = new Schema({
  event:                {type: ObjectId, ref: "Event"},
  progress_id:          {type:String, default:""},
  csv_id:               {type:Number, default:0, index: true},
  city:                 {type: String, default: "", index: true},
  region:               {type: String, default: "", index: true},
  district:             {type: String, default: "", index: true},
  subdistrict:          {type: String, default: "", index: true},
  boxdistrict:          {type: String, default: "", index: true},
  boxno:                {type: String, default: "", index: true},
  registered_vote_count:{type: Number},
  district_population:  {type: Number},
  name:                 {type: String, default: ""},
  vote:                 {type: Number},
  official_vote:        {type: Number},
  created_at:           {type: Date, default: Date.now},
  updated_at:           {type: Date, default: Date.now}
});

module.exports = mongoose.model('Candidate', Candidate);

