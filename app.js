var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');

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
var evidence_router     = require('./routes/evidence')
var progress_router     = require('./routes/progress')
var candidate_router    = require('./routes/candidate')
var box_router          = require('./routes/box')
var reading_router      = require('./routes/reading')
var results_router      = require('./routes/results')

// INIT EXPRESS ENGINE & PROPERTIES
var app = express();
require('express-helpers')(app);
var expressLayouts = require('express-ejs-layouts')

// Application configiration according to environment
var config = require('./config/environment.json')[app.get('env')];

// view engine setup
app.set('views', path.join(__dirname, 'views'));

// app.set('layout', 'myLayout') // defaults to 'layout'
app.use(expressLayouts)
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride());
app.use(cookieParser());
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));


// SETUP URL PATHS
app.use('/', routes);
app.use('/users', users);
app.use('/evidences', evidence_router);
app.use('/candidates', candidate_router);
app.use('/progress', progress_router);
app.use('/boxes', box_router);
app.use('/readings',reading_router);
app.use('/results',results_router);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// connect to Mongo when the app initializes
// TODO: move connector user pass to a config file
mongoose.connect(config.mongoURI);

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

// make config available app wide
app.set('config', config);
module.exports = app;
