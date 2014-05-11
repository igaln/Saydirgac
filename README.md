# Seçim Gözetimi Uygulaması

### Taslak:

https://hackpad.com/Seim-Gzetimi-in-Birlii-kOzmQOOluwG

### Teknoloji:

Stack:                  __ Node.js

Framework:              __ Express http://expressjs.com/guide.html

Template Engine:        __ EJS http://embeddedjs.com/

DB:						__ Mongodb w/ Mongoose http://mongoosejs.com/

### Installation:

git clone git@github.com:igaln/Saydirgac.git
cd Saydirgac
npm install

### Run:

node bin/www

### APP Structure

Views:
layout.ejs: shared template
sandik.ejs: base template for sandiks

Database Models:

User:
    id: session

<!-- Secim -->
Event:

<!-- Tutanak -->
Evidence:

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

## API

API/:il/:ilce/:sandikno