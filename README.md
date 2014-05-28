# Seçim Gözetimi Uygulaması

### Taslak

https://hackpad.com/Seim-Gzetimi-in-Birlii-kOzmQOOluwG

### Teknoloji

* Stack: Node.js
* Framework: Express http://expressjs.com/guide.html
* Template Engine: EJS http://embeddedjs.com/
* Database: Mongodb ve Mongoose http://mongoosejs.com/

### Installation

```
> git clone git@github.com:igaln/Saydirgac.git
> cd Saydirgac
> npm install
```

### Usage

#### Server

```
> node bin/www
```

#### Setup Environment 
(add to shell or use local)
>export env=development

### Deployment

Heroku Account and permissions are required for deployment.
For more details on heroku git deployment:
https://devcenter.heroku.com/articles/git

#### Heroku Setup Intructions
1) Install Heroku CLI https://devcenter.heroku.com/articles/heroku-command
2) Autheticate with Heroku, >heroku login
3) Add git remotes to your repository: 
for ex:  git remote add herokudev git@heroku.com:saydirac-dev.git

#### Dev: 			
URL: http://saydirac-dev.herokuapp.com/
Git Remote: git@heroku.com:saydirac.git

#### Production: 

URL: http://saydirac.herokuapp.com
Git Remote: git@heroku.com:saydirac-dev.git


#### Console

```
> node

.load test.js

or

require("./app")
var mongoose = require('mongoose');
var Event     = mongoose.model('Event');
var Evidence  = mongoose.model('Evidence');

var event = new Event({name:"Turkiye 2014 Yerel Seçimi",country:"Turkiye",type:"Yerel Secim"});
event.save();

var evidence = new Evidence({event:{id:event._id},city:"Istanbul"});
evidence.save();

var ev = Event.find({_id:event.id});
```

#### Browser / API

```
List evidences
http://localhost:3000/evidences

New evidence
http://localhost:3000/evidences/new

Show evidence
http://localhost:3000/evidences/:id
<!-- http://localhost:3000/:eventslug/:il/:ilce/:sandikno/:type -->

Edit evidence
http://localhost:3000/evidences/:id/edit


/:il/:ilce/:sandikno/edit

```

### Uygulama Yapısı

#### Models

Event (Seçim)

Evidence (Tutanaklar)

Candidate (Adaylar)

Provider (karşılaştırma yapılacak yerler, örn. YSK)

Client (sonuçları yayınlayacak yerler, örn. Tukiyenin Oylari)
