var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var candidate = require('./candidate');
var event = require('./event');

var evidence = new Schema({
  event:                {id: ObjectId, name: {type:String,default: ''}},
  il_ilce_sandikno_tur: {type: String},
  created_at:           {type: Date, default: Date.now},
  updated_at:           {type: Date, default: Date.now},
  user:                 {type: String, default: 'Anon'},
  city:                 {type: String, default: '', index: true},
  district:             {type: String, default: '', index: true},
  neighbourhood:        {type: String, default: ''},
  no:                   {type: String, default: '', index: true},
  type:                 {type: String, default: ''},
  img:                  {type: String, default: ''},
  digitized:            {
                          secmen_sayisi: Number,
                          sandiktan_cikan_gecerli_zarf_sayisi: Number,
                          sandiktan_cikan_gecersiz_zarf_sayisi: Number,
                          gecerli_oy_sayisi: Number,
                          gecersiz_oy_sayisi: Number,
                          flag: {type:Number, default:0},
                          resolved: {type:Boolean, default:false},
                          oylar: [candidate]
                        }
});

module.exports = mongoose.model('Evidence', evidence);

evidence.post('validate', function (doc) {

    console.log('%s has been saved', doc._id);

    if(doc.city != null && doc.district != null && doc.no != null && doc.type != null){
      doc.il_ilce_sandikno_tur = doc.city + "_" + doc.district + "_" + doc.no + "_" + doc.type;
    }

    console.log(doc);
});
