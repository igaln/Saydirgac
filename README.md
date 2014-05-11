# Seçim Gözetimi Uygulaması

### Taslak:

https://hackpad.com/Seim-Gzetimi-in-Birlii-kOzmQOOluwG

### Teknoloji:

Stack: Node.js

Framework: Express http://expressjs.com/guide.html

Template Engine: EJS http://embeddedjs.com/

Database: Mongodb ve Mongoose http://mongoosejs.com/

### Installation:

git clone git@github.com:igaln/Saydirgac.git

cd Saydirgac

npm install

### Run:

node bin/www

### Uygulama Yapısı

#### Models:

Event: Seçim

Evidence: Tutanaklar

Candidate: Adaylar

Provider: Karşılaştırma veri kaynakları

Client: Sonuçları yayınlayan yerler

#### Views:

layout.ejs: shared template

sandik.ejs: base template for sandiks

#### API

/:il/:ilce/:sandikno


#### SAMPLE DATA
->node
```
require("./app")
var mongoose = require('mongoose');
var Event     = mongoose.model('Event');
var Evidence  = mongoose.model('Evidence');
var event = new Event({name:"Turkiye 2014 Yerel Seçimi",country:"Turkiye",type:"Yerel Secim"});
var evidence = new Evidence({event:{id:event._id},city:"Istanbul"});
var ev = Event.find({_id:event.id});
```