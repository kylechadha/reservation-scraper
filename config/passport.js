var localStrategy = require('passport-local').Strategy;
var User = require('../app/models/user.js');

module.exports = function(passport) {

  // Session Management
  // ----------------------------------------------

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  })

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });


  // Sign Up
  // ----------------------------------------------

  passport.use('local-signup', new localStrategy( {
    usernameField : 'phone',
    passwordField : 'password',
    passReqToCallback : true
  },
  // ** Check nodejitsu docs, learn more about how done works.
  function(req, phone, password, done) {

    // ** Check out docs for process.nextTick as well
    // asynchronous
    // User.findOne wont fire unless data is sent back
    process.nextTick(function() {

      // find a user whose phone is the same as the forms phone
      User.findOne({ 'local.phone' :  phone }, function(err, user) {

        // if there are any errors, return the error
        if (err) {
          return done(err);
        }

        // check to see if theres already a user with that phone
        if (user) {
          return done(null, false, req.flash('userMessage', 'Whoops! Looks like someone has already signed up with that phone number.'));
        } else {
          // if there is no user with that phone
          // create the user
          var newUser = new User();

          // set the user's local credentials
          newUser.local.phone = phone;
          newUser.local.name = req.body.firstname;
          newUser.local.gender = req.body.gender;
          newUser.local.password = newUser.generateHash(password);

          // save the user
          newUser.save(function(err) {
            if (err) {
              throw err;
            }
            return done(null, newUser);
          });

        }

      });

    });

  }));


  // Login
  // ----------------------------------------------

  passport.use('local-login', new localStrategy({
    usernameField : 'phone',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, phone, password, done) { // callback with phone and password from our form

    // find a user whose phone is the same as the forms phone
    // we are checking to see if the user trying to login already exists
    User.findOne({ 'local.phone' :  phone }, function(err, user) {

      // if there are any errors, return the error before anything else
      if (err) {
        return done(err);
      }

      // if no user is found, return the message
      if (!user) {
        return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
      }

      // if the user is found but the password is wrong
      if (!user.validPassword(password)) {
        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
      }

      // all is well, return successful user
      return done(null, user);

    });

  }));

};