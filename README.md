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

Evidence: Tutanak

Provider: Karşılşatırma veri kaynaklari

Client: Sonuclari yayınlayan yerler

#### Views:

layout.ejs: shared template

sandik.ejs: base template for sandiks

#### API

/:il/:ilce/:sandikno