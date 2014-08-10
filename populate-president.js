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



//file_out = __dirname + "/config/candidates.json";

//var presidentdata = __dirname + "/config/ysk_il_il_sandik.csv";

//var dummy = "./config/president_part2.csv";

var dummy = "./config/data-101150-126385.csv";


var data = require("./config/event_data.json");
var date = Date.now();

var obj = { name: data.event.name,
            country: data.event.country,
            type: data.event.type,
            start_date: date
          };


Event.findOne({},function(err,event) {

  console.log(event);

   read_president_data(event, dummy);

});

// Event.remove({}, function(err) {
//   if (err) return handleError(err);
//   console.log("Event collection removed");

//   new Event(obj).save(function(err, event) {
//     if (err) return handleError(err);

//     console.log("Event %s created", event.id);

//     Candidate.remove({}, function(err) {
//       if (err) return handleError(err);
//       console.log("Candidate collection removed");
//       read_president_data(event, dummy);
//       //pop_candidate(event, url_in2);
//       //pop_candidate(event, url_in3);
//     });

//     Progress.remove({}, function(err) {
//       if (err) return handleError(err);
//       console.log("Progress collection removed");
//       //pop_progress(data, event);
//     });

//   });
// });


var read_president_data = function(event,data) {



var candidates = ["Ekmeleddin Mehmet İhsanoğlu","Recep Tayyip Erdoğan","Selahattin Demirtaş"];
   var i = 0;

     csv()
     .from(data)
     .to.array(function (data) {
            data.forEach(function (row) {
              
            
              if(i % 100 == 0)
                 console.log("col 0" + row[0]);

                var rvc;
                var dp;
               if( isNaN( parseInt(trim1(row[7])) ) ) {
                  // console.log(i);
                  // console.log("col 7" + row[0]);
                  // console.log(row[7]);
                    rvc = 0;

                } else {
                    rvc = parseInt(trim1(row[7]));
                }


                 if(isNaN(parseInt(trim1(row[8])))) {
                   // console.log(i);
                   //  console.log("col 8" + row[0]);
                   //  console.log(row[8]);
                    dp = 0;
                } else {
                    dp = parseInt(trim1(row[8]));
                }

                    var objProgress = new Progress(
                        {type: "BOX",
                        csv_id: row[0],  
                        city: row[1],
                        region: row[2],
                        district: row[3],
                        subdistrict: row[4],
                        boxdistrict: row[5],
                        boxno: row[6],
                        registered_vote_count:  rvc,
                        district_population:  dp,
                        event: event.id
                    });

                    objProgress.save(function(err, progress) {
                      if (err) return handleError(err);
                        console.log("Progress " + progress.id + " " + progress.type);

                                for(var kk = 0; kk < 3; kk++) {
                                    
                                    var objCandidate = {
                                      csv_id: row[0],
                                      city: row[1],
                                      region: row[2],
                                      district: row[3],
                                      subdistrict: row[4],
                                      boxdistrict: row[5],
                                      boxno: row[6],
                                      registered_vote_count:  rvc,
                                      district_population:  dp,
                                      name:candidates[kk],
                                      event: event.id,
                                      progress_id: progress.id,
                                    };
                                    new Candidate(objCandidate).save(function(err, candidate) {
                                      if (err) return handleError(err);
                                      console.log("Candidate %s created", candidate.id);
                                    });
                                  
                              }
                    });
        
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


var pop_progress = function(data, event){
  

  var objEvent = new Progress({type: "BOX",
                  id: data.id,
                  name: data.name
                  });


  objEvent.save(function(err, progress) {
    if (err) return handleError(err);
    console.log("Progress " + progress.id + " " + progress.type + " : "  + progress.box_count + " boxes");
  });

  // SAVE EVENT OBJECT

};


function trim1 (str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}



              // console.log("col 1 " + row[1]);
              // console.log("col 2 " + row[2]);
              // console.log("col 3 " + row[3]);
              // console.log("col 4 " + row[4]);
              // console.log("col 5 " + row[5]);
              // console.log("col 6 " + row[6]);
              // console.log("col 7 " + row[7]);
              // console.log("col 8 " + row[8]);
              // console.log("col 9 " + row[9]);

              // console.log("----------------- ");

//               ----------------- 
// col 0
// col 123 
// col 2ADANA
// col 3Akdeniz
// col 4ALADAĞ
// col 5GERDİBİ MAH.
// col 6GERDİBİ MAHALLESİ İLKOKULU
// col 71023 
// col 8   276 
// col 9   1,451,564 
// ----------------- 
