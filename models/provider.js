var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var provider = new Schema({
  name:                {type: String, default: "", index: true}, // YSK
  website:             {type: String, default: "", index: true}, // ysk.gov.tr
  end_point:           {type: String, default: "", index: true}, // ysk.gov.tr/bla/bla
  created_at:          {type: Date, default: Date.now},
  updated_at:          {type: Date, default: Date.now}
});

module.exports = mongoose.model('Provider', provider);

// TODO: her Provider icin farkli end_point'ini kullanan farkli scraper calisacak
// save.pre