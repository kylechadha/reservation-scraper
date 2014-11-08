var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');


// Schema
// ----------------------------------------------

var userSchema = mongoose.Schema({

  local : {
    phone : Number,
    name : String,
    gender : String,
    password : String,
    timeOfDay : String,
    affirmationType : String
  }

});


// Methods
// ----------------------------------------------

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
