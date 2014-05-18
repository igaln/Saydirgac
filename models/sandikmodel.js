// The Post model
 
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;
 
var sandikSchema = new Schema({
	// hersandik icin veriler
    // veri: ObjectId,  
    date_created: {type: Date, default: Date.now},
    author: {type: String, default: 'Anon'},
    il: {type: String, default: ''},
    ilce: {type: String, default: ''},
    no: {type: String, default: ''},
});
 
module.exports = mongoose.model('Sandik', sandikSchema);