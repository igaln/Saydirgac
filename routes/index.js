var express = require('express');
var router = express.Router();
var browser = require('../lib/browser_utils');

/* GET home page. */
router.get('/', function(req, res) {



   // res.redirect('/evidences/new');

    var ua = browser.browser_type(req.headers['user-agent']);
    if (ua.Mobile) {
       res.redirect('/evidences/new');
    } else {
       res.redirect('/readings/new');
    }


    //langind
    // res.render('index', {
    //     title: 'Saydıraç'
    // });
});

// Set language route
router.get('/lang/:lang', function(req, res) {

    //setting both session and local storage for access to current language
    req.session.lang = req.params.lang;
    //return back to where you started
    res.redirect(req.header('Referer') || '/')
})

router.post('/subscribe_email', function(req, res) {

    var MailChimpAPI = require('mailchimp').MailChimpAPI;
    var apiKey = process.env.CHIMP;
    console.log("chimp " + apiKey);

    try {
        var api = new MailChimpAPI(apiKey, {
            version: '2.0'
        });
    } catch (error) {
        console.log(error.message);
    }

    var merge_vars = {
        EMAIL: req.param('email'),
        FNAME: '',
        LNAME: ''
    };

    if (req.param('email') == "" || !/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(req.param('email'))) /* ' */ {

        res.send("error; email : '" + req.param('email') + "';");

    } else {

        api.call('lists', 'subscribe', {
            id: "6a94fb152a",
            email: {
                email: req.param('email')
            }
        }, function(error, data) {

            if (error) {
                res.send("error_chimp");

            } else {
                res.send(JSON.stringify(data)); // Do something with your data!
            }
        });
    }

});

module.exports = router;