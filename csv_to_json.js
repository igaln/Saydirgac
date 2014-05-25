
require("./app")
var request = require('request');
var csv = require('csv');
var fs = require('fs');
var mongoose  = require('mongoose');
var Candidate = mongoose.model('Candidate');

docid = "14KZYVcS5jwQFKvqTIjsyRZSCYJRYmEb9ZOY5yJ6oha8";  // spreadsheet id
gid = "0";  // type                                      // sheet id
url_in = "https://docs.google.com/spreadsheets/d/"+docid+"/export?gid="+gid+"&format=csv"
file_out = __dirname + "/config/candidates.json";

var i = 0;
// obj_out = {
//   "cities": [
//     {"Ağrı": {
//         "districts": [
//                       {"Ağrı Merkez": {"parties":
//                                                 [ {"Hak ve Eşitlik Partisi": "Törehan YILDIRIR"},
//                                                   {"Hak ve Özgürlükler Partisi": "Memet ÖLÇER"},
//                                                   {"Halkların Demokratik Partisi": "Tuncay TURANLI"},
//                                                   {"İşçi Partisi": "Hüseyin IRIZAK"}
//                                                 ]
//                                       }
//                       },
//                       {"Diyadin": {"parties":
//                                               [ {},
//                                                 {}
//                                               ]
//                                   }

//                       },
//                       "Doğubayazıt",
//                       "Eleşkirt",
//                       "Hamur",
//                       "Patnos",
//                       "Taşlıçay",
//                       "Tutak"
//                       ]
//                 }
//     },
//     {"Yalova": {
//         "districts": ["Yalova Merkez",
//                       "Altınova",
//                       "Armutlu",
//                       "Çınarcık",
//                       "Çiftlikköy",
//                       "Termal"
//         ]
//       }
//     }
//   ]
// };

request(url_in, function (error, response, body) {
  if (!error && response.statusCode == 200) {

    // csv()
    //   .from.string(body)
    //   .to.array(function(data){
    //     console.log(data)
    //   });
    csv()
      .from.string(body)
      .to.array(function (data) {

          var outObj = {};
          data.forEach(function (row) {
            if(i < 0){
              // header
            }else{
              // outObj.push({
              //     "o": row[0],
              //     "n": row[3]
              // });
              // outObj[parseInt(row[0], 10)] = parseFloat(row[4].substring(1,row[4].length));
              console.log(row);
              var obj = {
                city: row[0],
                district: row[1],
                party: row[2],
                type: row[3],
                person: row[4]
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