var mongoose = require('mongoose');


// Schema
// ----------------------------------------------

var restaurantSchema = mongoose.Schema({

  local : {
    phone : Number,
    name : String,
    gender : String,
    password : String,
    timeOfDay : String,
    affirmationType : String
  }

});

// Exports
// ----------------------------------------------
module.exports = mongoose.model('Restaurant', restaurantSchema);
