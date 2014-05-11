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

Event: Secim

Evidence: Tutanak

<!-- Karşılşatırma için -->
Provider:
  name: "YSK"
  website:
  reader: (js function)

<!-- Yayın için -->
Client:
  name: "Turkiye'nin Oylari"
  website:
  img:
  pub_URL: "/widget"

#### Views:

layout.ejs: shared template

sandik.ejs: base template for sandiks

#### API

API/:il/:ilce/:sandikno