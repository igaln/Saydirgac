require("./app")
var mongoose  = require('mongoose');
var Event     = mongoose.model('Event');
var Box       = mongoose.model('Box');
var Evidence  = mongoose.model('Evidence');
var Reading   = mongoose.model('Reading');
var Candidate = mongoose.model('Candidate');

var handleError = function(err){
  console.log(err);
}
var date = Date.now();

var event_obj = { name: "Türkiye 2014 Yerel Seçim Tekrarı, 1 Haziran 2014",
                  country: "Türkiye",
                  type: "Yerel Seçim Tekrarı",
                  start_date: date
                };

new Event(event_obj).save(function(err, event, count) {
  if (err) return handleError(err);
  console.log("event %s created", event.id);

  // var candidate_obj = { party: "Barış ve Demokrasi Partisi",
  //                       person: "Murat rohat ÖZBAY",
  //                       city: "Ağrı",
  //                       district: "Doğubayazıt",
  //                       type: "İL VE İLÇE BELEDİYE BAŞKANLIĞI"
  //                     };

  // new Candidate(candidate_obj).save(function(err, candidate, count) {
  //   if (err) return handleError(err);
  //   console.log("candidate %s created", candidate.id);
  // });

  var box_obj = { event: {id: event.id, name: event.name},
                  city: "Ağrı",
                  district: "Doğubayazıt",
                  no: "1234"
                };

  new Box(box_obj).save(function(err, box, count) {
    if (err) return handleError(err);
    console.log("box %s created", box.id);

    // event.boxes.push(box);
    // event.save(function(err, result) {
    //   if (err) return handleError(err);
    //   console.log("event %s saved", event.id);
    // });

    var evidence_obj = {box: {id: box.id, no: box.no},
                        city: "Ağrı",
                        district: "Doğubayazıt",
                        no: "1234",
                        type: ""
                      };

    new Evidence(evidence_obj).save(function(err, evidence, count) {
      if (err) return handleError(err);
      console.log("evidence %s created", evidence.id);

      var reading_obj = { evidence: {id: evidence.id},
                          kayitli_secmen: 100,
                          oy_kullanan_secmen: 90,
                          kanunen_oy_kullanan_secmen: 0,
                          toplam_oy_kullanan_secmen: 0,
                          gecerli_oy: 0,
                          itirazli_gecerli_oy: 0,
                          toplam_gecerli_oy: 0,
                          gecersiz_oy: 0
                        };

      new Reading(reading_obj).save(function(err, reading, count) {
        if (err) return handleError(err);
        // reading.results.push();

        console.log("reading %s created", reading.id);

      });

    });

  });

});


