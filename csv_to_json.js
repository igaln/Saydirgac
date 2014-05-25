require("./app");
var request = require('request');
var csv = require('csv');
var fs = require('fs');
var mongoose  = require('mongoose');
var Candidate = mongoose.model('Candidate');
var Event = mongoose.model('Event');

docid = "14KZYVcS5jwQFKvqTIjsyRZSCYJRYmEb9ZOY5yJ6oha8";  // spreadsheet id
gid = "0";                                               // sheet id
gid2 = "1223011841";                                     // sheet id
url_in = "https://docs.google.com/spreadsheets/d/"+docid+"/export?gid="+gid+"&format=csv"
url_in2 = "https://docs.google.com/spreadsheets/d/"+docid+"/export?gid="+gid2+"&format=csv"
file_out = __dirname + "/config/candidates.json";

events = Event.find(function(err, events){
  if (err) return handleError(err);
  console.log("event " + events[0].name);

  Candidate.remove({}, function(err) {
  if (err) return handleError(err);
    console.log('Candidate collection removed')
    csv_to_model(events[0], url_in);
    csv_to_model(events[0], url_in2);
  });

});

var csv_to_model = function(event, url){
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // console.log(body);
      // csv()
      //   .from.string(body)
      //   .to.array(function(data){
      //     console.log(data)
      //   });
      var i = 0;
      csv()
        .from.string(body)
        .to.array(function (data) {
            data.forEach(function (row) {
              if(i < 1){
                // header
              }else{
                // console.log(row);
                var obj = {
                  city: row[0],
                  district: row[1],
                  party: row[2],
                  type: row[3],
                  person: row[4],
                  event: event.id
                };
                new Candidate(obj).save(function(err, candidate, count) {
                  if (err) return handleError(err);
                  console.log("candidate %s created", candidate.id);
                });
              }
              i += 1;
            });
        })
        .on('close', function(count){
          // when writing to a file, use the 'close' event
          // the 'end' event may fire before the file has been written
          // fs.writeFileSync(file_out, 'var mmcore.cateroryRedirectList = ' + JSON.stringify(outObj) + ';');
          console.log('Number of lines: '+count);
        })
        .on('error', function(error){
          console.log(error.message);
        });
    }
  });
}


var handleError = function(err){
  console.log(err);
}