var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var candidate = require('candidate');

var evidence = new Schema({
  event:          {id: ObjectId, name: {type:String,default: ''}},
  created_at:     {type: Date, default: Date.now},
  updated_at:     {type: Date, default: Date.now},
  user:           {type: String, default: 'Anon'},
  city:           {type: String, default: '', index: true},
  district:       {type: String, default: '', index: true},
  neighbourhood:  {type: String, default: ''},
  no:             {type: String, default: '', index: true},
  type:           {type: String, default: ''},
  img:            {type: String, default: ''},
  digitized:      {
                    secmen_sayisi: Number,
                    sandiktan_cikan_gecerli_zarf_sayisi: Number,
                    sandiktan_cikan_gecersiz_zarf_sayisi: Number,
                    gecerli_oy_sayisi: Number,
                    gecersiz_oy_sayisi: Number,
                    oylar: [candidate]
                  }
});

module.exports = mongoose.model('Evidence', evidence);
