var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var ejs = require('ejs');
var moment = require('moment');

var Polyglot = require('node-polyglot');

//LOAD MODELS
require('./models/event');
require('./models/progress');
require('./models/box');
require('./models/candidate');
require('./models/evidence');
require('./models/reading');

//INIT ROUTES
var routes              = require('./routes/index');
var users               = require('./routes/users');
var evidence_router     = require('./routes/evidence');
var progress_router     = require('./routes/progress');
var candidate_router    = require('./routes/candidate');
var box_router          = require('./routes/box');
var reading_router      = require('./routes/reading');
var results_router      = require('./routes/results');
var about_router        = require('./routes/about');

// INIT EXPRESS ENGINE & PROPERTIES
var app = express();
require('express-helpers')(app);
var expressLayouts = require('express-ejs-layouts');

// add translation filter to EJS
ejs.filters.translate = translate;
ejs.filters.currentLang = currentLang;

// Application configiration according to environment
console.log('CURRENT ENVIRONMENT ', process.env.env);
var config = require('./config/environment.json')[process.env.env];

// Unfortunate Safari cache workaround for page refreshes on language reset
app.disable('etag');

// view engine setup
app.set('views', path.join(__dirname, 'views'));

// app.set('layout', 'myLayout') // defaults to 'layout'
app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride());
app.use(cookieParser());
app.use(cookieSession({ secret: 'saydirmadansaydiracolmaz'}));
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {

  if(!req.session.lang) {
     req.session.lang = 'tr';
  }

  app.set('lang', req.session.lang);
  var lnphrases = require('./lang/' + req.session.lang + '.json');
    //pass the current dictionary to Polyglot
  var polyglot = new Polyglot({phrases : lnphrases});
  res.locals.t =  function(arg) {
    return polyglot.t(arg);
  };

  res.locals.round =  function(val) {
    return Math.floor(val*100) / 100;
  };

  next();
});

// SETUP URL PATHS
app.use('/', routes);
app.use('/users', users);
app.use('/evidences', evidence_router);
app.use('/candidates', candidate_router);
app.use('/progress', progress_router);
app.use('/boxes', box_router);
app.use('/readings', reading_router);
app.use('/results', results_router);
app.use('/about', about_router);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// add this to run POPULATE SCRIPTS at different env  || process.env.env === "development"  || 

console.log(process.env.AWS_ACCESS_KEY_ID);

if(process.env.env === 'local')
  mongoose.connect(config.mongoURI);
else
  mongoose.connect(process.env.MONGOHQ_URL);

/// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

function translate(data) {
  //according to language change, reload dictionary
  var lnphrases = require('./lang/' + data.lan + '.json');
  //pass the current dictionary to Polyglot
  var polyglot = new Polyglot({phrases : lnphrases});
  return polyglot.t(data.key);
}

function currentLang() {
    return lang.currentLanguage;
}

// make config available app wide
app.set('config', config);
module.exports = app;

var Evidence  = mongoose.model('Evidence');

setInterval(function(){

  // first pull the evidence TODO: 2 type of templates according to Evidence
  Evidence.find({locked:true,read:false,resolved:false},function(err, evidences) {
    if (err) return handleError(err);
  
    // console.log('----------------');
    // console.log(evidences.length + " tutanak kiltli"); 
    // console.log('----------------');
    evidences.forEach(function(evidence) {
            var startTime = new Date(evidence.updated_at);

           
            // later record end time
            var endTime = new Date();

            // time difference in ms
            var timeDiff = endTime - startTime;

            // strip the miliseconds
            var timeDiff =  timeDiff/1000;

            // get seconds (Original had 'round' which incorrectly counts 0:28, 0:29, 1:30 ... 1:59, 1:0)
            var seconds = Math.round(timeDiff % 60);

            // remove seconds from the date
            timeDiff = Math.floor(timeDiff / 60);

            // get minutes
            var minutes = Math.round(timeDiff % 60);

             console.log(minutes);

             if(minutes > 3) {
                evidence.locked = false;
                evidence.save();
             }

    });
  });
}, 5000);
