var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.Types.ObjectId;

var Reading = new Schema({
  evidence:                     {type: ObjectId, ref: 'Evidence'},
  kayitli_secmen:               Number,
  oy_kullanan_secmen:           Number,
  kanunen_oy_kullanan_secmen:   Number,
  toplam_oy_kullanan_secmen:    Number,
  sandiktan_cikan_zarf_sayisi:  Number,
  gecerli_zarf_sayisi:          Number,
  itirazsiz_gecerli_oy:         Number,
  itirazli_gecerli_oy:          Number,
  gecerli_oy:                   Number,
  gecersiz_oy:                  Number,
  toplam_gecerli_oy:            Number,
  votes:                        [{
                                  id: {type: ObjectId, ref: 'Candidate'},
                                  vote: Number
                                }],
  flag_count:                   {type: Number, default: 0},
  resolved:                     {type: Boolean, default: false},
  user:                         {type: String, default: 'Anon'},
  created_at:                   {type: Date, default: Date.now},
  updated_at:                   {type: Date, default: Date.now}
});

module.exports = mongoose.model('Reading', Reading);