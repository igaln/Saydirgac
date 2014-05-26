var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.Types.ObjectId;

var Reading = new Schema({

  evidence:                   { type : Schema.ObjectId, ref : 'Evidence' },
  type:                                String,
  
  baskan_kayitli_secmen:               Number,
  baskan_oy_kullanan_secmen:           Number,
  baskan_kanunen_oy_kullanan_secmen:   Number,
  baskan_toplam_oy_kullanan_secmen:    Number,
  baskan_sandiktan_cikan_zarf_sayisi:  Number,
  baskan_gecerli_zarf_sayisi:          Number,
  baskan_itirazsiz_gecerli_oy:         Number,
  baskan_itirazli_gecerli_oy:          Number,
  baskan_gecerli_oy:                   Number,
  baskan_gecersiz_oy:                  Number,
  baskan_toplam_gecerli_oy:            Number,

  meclis_kayitli_secmen:               Number,
  meclis_oy_kullanan_secmen:           Number,
  meclis_kanunen_oy_kullanan_secmen:   Number,
  meclis_toplam_oy_kullanan_secmen:    Number,
  meclis_sandiktan_cikan_zarf_sayisi:  Number,
  meclis_gecerli_zarf_sayisi:          Number,
  meclis_itirazsiz_gecerli_oy:         Number,
  meclis_itirazli_gecerli_oy:          Number,
  meclis_gecerli_oy:                   Number,
  meclis_gecersiz_oy:                  Number,
  meclis_toplam_gecerli_oy:            Number,
 

  baskan_results:                    [{
                                      id: ObjectId,       // Candidate.id
                                      party: String,
                                      person: String,
                                      type: String,       // sandık türü
                                      votes: Number
                                    }],

  meclis_results:                    [{
                                      id: ObjectId,       // Candidate.id
                                      party: String,
                                      person: String,
                                      type: String,       // sandık türü
                                      votes: Number
                                    }],
                              
  flag:                       {type: Number, default: 0},
  resolved:                   {type: Boolean, default: false},
  user:                       {type: String, default: 'Anon'},
  created_at:                 {type: Date, default: Date.now},
  updated_at:                 {type: Date, default: Date.now}

});

module.exports = mongoose.model('Reading', Reading);