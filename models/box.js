var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

// var Event = require('./event');

var Box = new Schema({
  event:                {id: ObjectId, name: {type:String, required: true}},
  evidences:            [{id: ObjectId, img:String}],
  candidates:           [{id: ObjectId, party:String, person:String}],
  city:                 {type: String, required: true, index: true},
  district:             {type: String, required: true, index: true},
  no:                   {type: String, required: true, index: true},
  il_ilce_sandikno_tur: {type: String, index: true},
  results:               [{
                          id: ObjectId,       // Candidate.id
                          party: String,
                          person: String,
                          type: String,       // sandık türü
                          votes: Number
                        }],
  official_results:     [{
                          id: ObjectId,       // Candidate.id
                          party: String,
                          person: String,
                          type: String,       // sandık türü
                          votes: Number
                        }],
  created_at:           {type: Date, default: Date.now},
  updated_at:           {type: Date, default: Date.now}
});

module.exports = mongoose.model('Box', Box);

Box.post('validate', function (box) {
    // console.log('evidence %s saved', box._id);
    if(box.city != null && box.district != null && box.no != null && box.type != null){
      box.il_ilce_sandikno_tur = box.city + "_" + box.district + "_" + box.no + "_" + box.type;
    }
    // console.log(box);
});

var Event = mongoose.model('Event');

Box.post('save', function (box) {

    Event.find({id: box.event.id}, function(err, events) {
      if (err) return handleError(err);
      var event = events[0];
      event.boxes.push(box);

      event.save(function(err, result) {
        if (err) return handleError(err);
        console.log("event %s saved", event.id);
      });
    });

    console.log('%s has been saved', box._id);
});

