var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  console.log("lang " + req.session.lang);

  res.render('index', { title: 'Saydıraç' });
});




router.post('/subscribe_email',function(req,res) {

	var MailChimpAPI = require('mailchimp').MailChimpAPI;
	var apiKey = process.env.CHIMP;
	console.log("chimp " + apiKey);

	try {
	  var api = new MailChimpAPI(apiKey, { version : '2.0' });
	} catch (error) {
	  console.log(error.message);
	}

  	var merge_vars = {
	    EMAIL: req.param('email'),
	    FNAME: '',
	    LNAME: ''
	};

  if (req.param('email')=="" || !/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(req.param('email'))) /* ' */ {

    res.send("error; email : '"+ req.param('email') + "';");

  } else {

    api.call('lists', 'subscribe', { id: "6a94fb152a", email: { email: req.param('email') } }, function (error, data) {

      if (error) {
        res.send("error_chimp");

      } else {
        res.send(JSON.stringify(data)); // Do something with your data!
      }
    });
  }

});

module.exports = router;
