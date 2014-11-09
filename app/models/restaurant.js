var mongoose = require('mongoose');


// Schema
// ----------------------------------------------

var restaurantSchema = mongoose.Schema({

  name : String

});

// Exports
// ----------------------------------------------
module.exports = mongoose.model('Restaurant', restaurantSchema);
