require("./app");
var request = require("request");
var csv = require("csv");
var fs = require('fs');
var mongoose  = require("mongoose");

var handleError = function(err){
  console.log(err);
};

docid = "1R1ErwV6JAoI2aCULPVwBWfM-Fv2448ZaIziR4HhvEVs";  // doc id
gid = "0";                                               // sheet id
url = "https://docs.google.com/spreadsheets/d/"+docid+"/export?gid="+gid+"&format=csv";

file_tr = __dirname + "/lang/tr.json";
file_kd = __dirname + "/lang/kd.json";
file_en = __dirname + "/lang/en.json";

request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var i = 0;
      var obj_tr = {};
      var obj_kd = {};
      var obj_en = {};
      csv()
        .from.string(body)
        .to.array(function (data) {
            // console.log(data)
            data.forEach(function (row) {
              if(i < 1){
                // header
              }else{
                // console.log(row);
                obj_tr[row[0]] = row[1];
                obj_kd[row[0]] = row[2];
                obj_en[row[0]] = row[3];
              }
              i += 1;
            });
        })
        .on("end", function(count){
          // console.log(obj_tr);
          // console.log(obj_kd);
          // console.log(obj_en);
          fs.writeFile(file_tr, JSON.stringify(obj_tr), function (err) {
            if (err) throw err;
            console.log(file_tr);
          });
          fs.writeFile(file_kd, JSON.stringify(obj_kd), function (err) {
            if (err) throw err;
            console.log(file_kd);
          });
          fs.writeFile(file_en, JSON.stringify(obj_en), function (err) {
            if (err) throw err;
            console.log(file_en);
          });
          // fs.writeFileSync(file_tr, JSON.stringify(obj_tr) );
          // fs.writeFileSync(file_kd, JSON.stringify(obj_kd) );
          // fs.writeFileSync(file_en, JSON.stringify(obj_en) );
          // console.log("Number of lines: " + count);
        })
        .on("error", function(error){
          console.log(error.message);
        });
    }
  });