require("./app");
var request = require("request");
var csv = require("csv");
// var fs = require('fs');
var mongoose  = require("mongoose");
var Candidate = mongoose.model("Candidate");
var Event = mongoose.model("Event");
var Progress = mongoose.model("Progress");

var handleError = function(err){
  console.log(err);
};

docid = "14KZYVcS5jwQFKvqTIjsyRZSCYJRYmEb9ZOY5yJ6oha8";  // doc id
gid = "0";                                               // sheet id
gid2 = "1223011841";
gid3 = '2116057599';                                     // sheet id
url_in = "https://docs.google.com/spreadsheets/d/"+docid+"/export?gid="+gid+"&format=csv";
url_in2 = "https://docs.google.com/spreadsheets/d/"+docid+"/export?gid="+gid2+"&format=csv";
url_in3 = "https://docs.google.com/spreadsheets/d/"+docid+"/export?gid="+gid3+"&format=csv";
file_out = __dirname + "/config/candidates.json";


var data = require("./config/event_data.json");
var date = Date.now();

var obj = { name: data.event.name,
            country: data.event.country,
            type: data.event.type,
            start_date: date
          };

Event.remove({}, function(err) {
  if (err) return handleError(err);
  console.log("Event collection removed");

  new Event(obj).save(function(err, event) {
    if (err) return handleError(err);

    console.log("Event %s created", event.id);

    Candidate.remove({}, function(err) {
      if (err) return handleError(err);
      console.log("Candidate collection removed");
      pop_candidate(event, url_in);
      pop_candidate(event, url_in2);
      pop_candidate(event, url_in3);
    });

    Progress.remove({}, function(err) {
      if (err) return handleError(err);
      console.log("Progress collection removed");
      pop_progress(data, event);
    });

  });
});

var pop_progress = function(data, event){
  var objEvent = new Progress({type: "Event",
                  id: event.id,
                  name: event.name,
                  box_count: 0
                  });

  
  //BEGIN CITY CREATION
  var cities = data.cities;
  for (var i = 0; i < cities.length; i++) {
    
    var objCity = new Progress({ type: "City",
                    id: event.id + "_" + cities[i].name,
                    name: cities[i].name,
                    box_count: 0,
                    parent: event
                  });

    // BEGIN DISTRICT OBJECT CREATION
    var districts = cities[i].districts;
    for (var j = 0; j < districts.length; j++) {
         
          var objDistrict =  new Progress({ type: "District",
                              id: cities[i].name + "_" + districts[j].name,
                              name: districts[j].name,
                              box_count: 0
                            });

          objDistrict.parent = objCity;


          boxes = districts[j].boxes;
         
          if(boxes.to && boxes.from){
            
            objEvent.box_count += boxes.to + 1 - boxes.from;
            objCity.box_count += boxes.to + 1 - boxes.from;
            objDistrict.box_count = boxes.to + 1 - boxes.from;

           objDistrict.save(function(err, progress) {
              if (err) return handleError(err);
              console.log("Progress " + progress.id + " " + progress.type + " : " + progress.name + " " + progress.box_count + " boxes");
            });
          }

          for (var no = boxes.from; no < boxes.to+1; no++) {
            
            var objBox = new Progress({ type: "Box",
                          id: districts[j].name + "_" + no.toString(),
                          name: no.toString(),
                          box_count: 0
                        });

            objBox.parent = objDistrict;
            objBox.save(function(err, progress) {
              if (err) return handleError(err);
              console.log("Progress " + progress.id + " " + progress.type + " : " + progress.name);
            });
          }
    } // FINISH DISTRICT CREATION

      objCity.save(function(err, progress) {
      if (err) return handleError(err);
      console.log("Progress " + progress.id + " " + progress.type + " : " + progress.name + " " + progress.box_count + " boxes");
    });

  } // END CITY OBJECT CREATION

  objEvent.save(function(err, progress) {
    if (err) return handleError(err);
    console.log("Progress " + progress.id + " " + progress.type + " : " + progress.name + " " + progress.box_count + " boxes");
  });

  // SAVE EVENT OBJECT

};


var pop_candidate = function(event, url){
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
                var objCandidate = {
                  city: row[0],
                  district: row[1],
                  party: row[2],
                  type: row[3],
                  person: row[4],
                  event: event.id
                };
                new Candidate(objCandidate).save(function(err, candidate) {
                  if (err) return handleError(err);
                  console.log("Candidate %s created", candidate.id);
                });
              }
              i += 1;
            });
        })
        .on("close", function(count){
          // when writing to a file, use the 'close' event
          // the 'end' event may fire before the file has been written
          // fs.writeFileSync(file_out, 'var mmcore.cateroryRedirectList = ' + JSON.stringify(outObj) + ';');
          console.log("Number of lines: " + count);
        })
        .on("error", function(error){
          console.log(error.message);
        });
    }
  });
};


