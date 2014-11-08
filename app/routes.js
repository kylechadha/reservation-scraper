var User = require('./models/user');

module.exports = function(app, passport) {

  // Index Route
  // ----------------------------------------------
  app.get('/', function(req, res) {
    res.render('layout', { message: req.flash('userMessage') });
  });

  // Sign Up Route
  app.post('/', function(req, res, next) {

    req.body.phone = req.body.phone.replace(/\D/g,"");

    if (req.body.phone.length !== 10) {
      req.flash('userMessage', 'Sorry! You need to enter a valid 10 digit phone number.');
      res.redirect('/');
    }
    else if (!req.body.firstname) {
      req.flash('userMessage', 'Please enter your first name.');
      res.redirect('/');
    }
    else if (!req.body.gender) {
      req.flash('userMessage', 'Please enter your gender.');
      res.redirect('/');
    }
    else if (req.body.password < 6 || req.body.password > 30) {
      req.flash('userMessage', 'Please enter a valid password.');
      res.redirect('/');
    }
    else {
      next();
    }

  }, passport.authenticate('local-signup', {
      successRedirect : '/profile', // redirect to the secure profile section
      failureRedirect : '/', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
  }));


  // Users Route
  // ----------------------------------------------
  app.get('/users', function(req, res) {

    User.find(function(err, users) {
      if (err) {
        res.send(err);
      }
      res.json(users);
    });

  });


  // Login Routes
  // ----------------------------------------------
  app.get('/login', function(req, res) {
    res.render('login', { message: req.flash('loginMessage') });
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));


  // User Profile Route
  // ----------------------------------------------
      // we will want this protected so you have to be logged in to visit
      // we will use route middleware to verify this (the isLoggedIn function)
  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile', {
      user : req.user
    });
  });


  // Logout Route
  // ----------------------------------------------
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

};


// Route Middleware
function isLoggedIn(req, res, next) {

  // If authenticated, proceed
  if (req.isAuthenticated()) {
    return next();
  }

  // If not, redirect them to login
  res.redirect('/login');

}

